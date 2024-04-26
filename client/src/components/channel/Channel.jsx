import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './channel.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../../features/chat/chatSlice';
import { selectAuth } from '../../features/auth/authSlice';
import { joinChannel, sendMessage } from '../../services/socketService';
import { getSingleChatAPI } from '../../features/chat/chatApiSlice';
import timeCal from '../../utils/timeCal';

const Channel = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { chats } = useSelector(selectChat);
  const { admin, permissions } = useSelector(selectAuth);
  const [message, setMessage] = useState('');
  const [limit, setLimit] = useState(20);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    sendMessage(slug, admin._id, message);
    setMessage('');
  };

  const handleLoadMore = () => {
    const newLimit = limit + 20;
    setLimit(newLimit);
    dispatch(getSingleChatAPI({ slug, limit: newLimit }));
  };

  useEffect(() => {
    if (!chats[slug]) {
      joinChannel(slug, limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats[slug]?.messages]);

  return (
    <div className='page-wrapper'>
      <div className='content container-fluid'>
        <div className='page-header'>
          <div className='row'>
            <div className='col-sm-9 col-auto'>
              <div className='main'>
                <div className='card'>
                  <div className='card-body'>
                    <div className='message-container'>
                      <div className='d-flex justify-content-center'>
                        {chats[slug]?.count > limit && (
                          <button
                            type='button'
                            className='btn btn-primary btn-sm'
                            onClick={handleLoadMore}
                          >
                            Load more
                          </button>
                        )}
                      </div>
                      {chats[slug]?.messages
                        .slice()
                        .reverse()
                        .map((data, index) => (
                          <div key={index}>
                            {data.admin?._id !== admin._id ? (
                              <>
                                <h6 className='time'>
                                  {timeCal(data.createdAt)}
                                </h6>
                                <div className='message-box'>
                                  <img
                                    className='chat-img'
                                    src='https://powerpackelements.com/wp-content/uploads/2017/11/Team-memeber-01.png'
                                    alt=''
                                  />
                                  <div className='message'>
                                    <p>{data.text}</p>
                                    <h6>
                                      send by
                                      <strong>{data.admin?.first_nm}</strong>
                                    </h6>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <h6 className='time'>
                                  {timeCal(data.createdAt)}
                                </h6>
                                <div className='message-box right'>
                                  <div className='message'>
                                    <p>{data.text}</p>
                                    <h6>
                                      me <strong>{data.admin.first_nm}</strong>
                                    </h6>
                                  </div>
                                  <img
                                    className='chat-img'
                                    src='https://powerpackelements.com/wp-content/uploads/2017/11/Team-memeber-01.png'
                                    alt=''
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <hr />
                    {(admin?.role.slug === 'super-admin' ||
                      permissions?.some((p) => p.slug === 'channels')) && (
                      <div className='send-box'>
                        <input
                          onKeyUp={(e) => e.key === 'Enter' && handleSend()}
                          onChange={handleMessage}
                          value={message}
                          className='type-box form-control'
                          type='text'
                          placeholder='Type a message'
                        />
                        <button
                          className='btn btn-primary'
                          onClick={handleSend}
                        >
                          Send <i className='fa fa-paper-plane-o'></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-3 col'>
              <h3 className='page-title'>Admin</h3>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link to='/'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item active'>
                  <Link to='/channels'>Channels</Link>
                </li>
                <li className='breadcrumb-item active'>{slug}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;

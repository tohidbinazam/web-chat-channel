import DataFilter from './options/DataFilter';
import FindUser from './options/FindUser';

const FilterTab = () => {
  return (
    <div className='row'>
      <div className='col-md-12'>
        <ul className='nav nav-pills mb-3' id='pills-tab' role='tablist'>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link active'
              id='pills-user-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-user'
              type='button'
              role='tab'
              aria-controls='pills-user'
              aria-selected='true'
            >
              User
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-data-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-data'
              type='button'
              role='tab'
              aria-controls='pills-data'
              aria-selected='false'
            >
              Data
            </button>
          </li>
        </ul>
        <div className='tab-content' id='pills-tabContent'>
          <div
            className='tab-pane fade show active'
            id='pills-user'
            role='tabpanel'
            aria-labelledby='pills-user-tab'
          >
            <FindUser />
          </div>
          <div
            className='tab-pane fade'
            id='pills-data'
            role='tabpanel'
            aria-labelledby='pills-data-tab'
          >
            <DataFilter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTab;

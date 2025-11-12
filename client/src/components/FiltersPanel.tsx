type Props = {
  searchName: string;
  setSearchName: (s: string) => void;
  searchEmail: string;
  setSearchEmail: (s: string) => void;
  searchPhone: string;
  setSearchPhone: (s: string) => void;
  searchDateFrom: string;
  setSearchDateFrom: (s: string) => void;
  searchDateTo: string;
  setSearchDateTo: (s: string) => void;
};

export default function FiltersPanel({ searchName, setSearchName, searchEmail, setSearchEmail, searchPhone, setSearchPhone, searchDateFrom, setSearchDateFrom, searchDateTo, setSearchDateTo }: Props) {
  return (
    <div className="mb-3">
      <div className="d-flex align-items-center mb-2" style={{gap: "0.5rem"}}>
        <span style={{fontSize: "1.2em", color: "#0d6efd"}} title="Filter">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .39.812l-4.6 5.748V13.5a.5.5 0 0 1-.276.447l-3 1.5A.5.5 0 0 1 6 15v-7.94L1.61 1.812A.5.5 0 0 1 1.5 1.5zm1.634.5L6.5 7.06V14l2-1V7.06l3.366-5.06H3.134z"/>
          </svg>
        </span>
        <span className="text-muted" style={{fontWeight: 500, letterSpacing: "0.5px"}}>Filter Appointments</span>
      </div>
      <div className="row g-2 align-items-end">
        <div className="col-md-3">
          <input
            id="filter-name"
            type="text"
            className="form-control"
            placeholder="Name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            id="filter-email"
            type="text"
            className="form-control"
            placeholder="Email"
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            id="filter-phone"
            type="text"
            className="form-control"
            placeholder="Phone"
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            id="date-from"
            type="date"
            className="form-control"
            value={searchDateFrom}
            onChange={e => setSearchDateFrom(e.target.value)}
            placeholder="Date From (dd-mm-yyyy)"
          />
        </div>
        <div className="col-md-2">
          <input
            id="date-to"
            type="date"
            className="form-control"
            value={searchDateTo}
            onChange={e => setSearchDateTo(e.target.value)}
            placeholder="Date To (dd-mm-yyyy)"
          />
        </div>
      </div>
    </div>
  );
}

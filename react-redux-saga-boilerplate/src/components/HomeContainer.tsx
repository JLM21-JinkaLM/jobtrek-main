import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: number;
  userId: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  dateOfPost: string;
  category: string;
  skills: string;
  lastDate: string;
}

interface HomeContainerProps {
  login: boolean;
  userDetails: object;
}

const LoginPromptModal: React.FC<{ show: boolean; handleClose: () => void }> = ({
  show,
  handleClose,
}) => {
  let navigate = useNavigate();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Please Login/Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You need to be logged in to apply for jobs.</p>
        <Button className="m-2" variant="primary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            navigate('/login');
          }}
        >
          log in
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const HomeContainer: React.FC<HomeContainerProps> = ({ userDetails, login }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [jobSkills, setJobSkillsSearch] = useState<string>('');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [jobCounts, setJobCounts] = useState({
    'Software Development': 0,
    Marketing: 0,
    Finance: 0,
    Design: 0,
  });
  const navigate = useNavigate();

  console.log(userDetails, '............', login);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/joblisting'); // Replace with your API endpoint
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchJobCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/jobcounts'); // Replace with your API endpoint
        const data = await response.json();
        setJobCounts(data.counts);
      } catch (error) {
        console.error('Error fetching job counts:', error);
      }
    };

    fetchJobs();
    fetchJobCounts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const applyJobHandler = (jobId: number) => {
    if (login) {
      navigate(`/viewdetails/${jobId}`, { state: { userDetails } });
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewMoreJobs = () => {
    setShowAllJobs(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = jobs.filter(
      job =>
        (jobSkills === '' || job.skills.toLowerCase().includes(jobSkills.toLowerCase())) &&
        (locationSearch === '' ||
          job.location.toLowerCase().includes(locationSearch.toLowerCase())) &&
        (categorySearch === '' ||
          job.category.toLowerCase().includes(categorySearch.toLowerCase())),
    );
    setFilteredJobs(filtered);
  };

  const handleReset = () => {
    setJobSkillsSearch('');
    setLocationSearch('');
    setCategorySearch('');
    setFilteredJobs(jobs);
  };

  const handleCategoryClick = (category: string) => {
    setCategorySearch(category);
    const filtered = jobs.filter(job => job.category.toLowerCase() === category.toLowerCase());
    setFilteredJobs(filtered);
  };

  return (
    <div className="homepage-container pt-5 mt-5">
      <div className="container">
        <div className="jumbotron mt-5">
          <h1 className="display-4">Find Job</h1>
          <p className="lead">Search jobs by skill, location, and category.</p>

          <form onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group col-md-4">
                <input
                  type="text"
                  className="form-control"
                  id="inputSkill"
                  placeholder="Skill"
                  value={jobSkills}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setJobSkillsSearch(e.target.value)
                  }
                />
              </div>
              <div className="form-group col-md-4">
                <input
                  type="text"
                  className="form-control"
                  id="inputLocation"
                  placeholder="Location"
                  value={locationSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch(e.target.value)
                  }
                />
              </div>
              <div className="form-group col-md-4">
                <select
                  id="inputCategory"
                  className="form-control"
                  value={categorySearch}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCategorySearch(e.target.value)
                  }
                >
                  <option value="">Choose Category...</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <Button variant="secondary" onClick={handleReset} className="ml-2">
              Reset
            </Button>
          </form>
        </div>
        <div className="row m-5">
          <div className="col-md-12">
            <h2 className="text-center mb-4 text-dark">Explore by Categories</h2>
          </div>
          <div className="col-md-3">
            <div
              className="card bg-dark text-white"
              onClick={() => handleCategoryClick('Software Development')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title">Software Development</h5>
                <p className="card-text">Total Jobs: {jobCounts['Software Development']}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card bg-dark text-white"
              onClick={() => handleCategoryClick('Marketing')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title">Marketing</h5>
                <p className="card-text">Total Jobs: {jobCounts['Marketing']}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card bg-dark text-white"
              onClick={() => handleCategoryClick('Finance')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title">Finance</h5>
                <p className="card-text">Total Jobs: {jobCounts['Finance']}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card bg-dark text-white"
              onClick={() => handleCategoryClick('Design')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title">Design</h5>
                <p className="card-text">Total Jobs: {jobCounts['Design']}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="text-center mb-4 text-dark">Featured Jobs</h2>
          </div>
          {filteredJobs.slice(0, showAllJobs ? filteredJobs.length : 9).map(job => (
            <div className="col-md-4 mb-4" key={job.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-dark">{job.title}</h5>
                  <p className="card-text text-dark">Location: {job.location}</p>
                  <p className="card-text text-dark">Salary: {job.salary}</p>
                  <p className="card-text text-dark">Date Posted: {formatDate(job.dateOfPost)}</p>
                  <button onClick={() => applyJobHandler(job.id)} className="btn btn-primary">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showAllJobs && filteredJobs.length > 9 && (
          <div className="text-center mt-4">
            <button onClick={handleViewMoreJobs} className="btn btn-secondary">
              View More Jobs
            </button>
          </div>
        )}
        <LoginPromptModal show={showModal} handleClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default HomeContainer;

import { useState } from 'react';
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";
import ControlledCarousel from "../components/PhotoGallery";
import RegistrationForm from "../components/ActivityRegistration";
import BoardGamesComponent from "../components/BoardGamesComponent";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../index.css";

const Recreation = () => {
  const [date, setDate] = useState(new Date());

  const onChangeDate = (newDate) => {
    setDate(newDate);
  };

  return (
      <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div><br />
      <h1 className="center">EMS- Recreation Activity</h1>
      <p className="center" id="opening">
      At EMS, we believe that the success of our organization is directly connected to a happy and engaged workforce. Keeping this in mind, we emphasize employee well-being by focusing on recreation activities that help develop a positive work environment and encourage team building. We provide the recreation activity page within our Employee Management System (EMS) to keep our team informed and involved.
      </p><br />
      <hr className="hr" />

      <div className="divcenter"><BoardGamesComponent /></div>

      <hr className="hr" />

      <div className="ems-container">
        <div className="ems-right">
        <h3>Calendar</h3>
        <Calendar onChange={onChangeDate} value={date} /><br />
        
      <h3>Wellness Programs</h3>
      <p className="paragraph">The wellness programs have been structured to promote physical and mental well-being. Practice yoga, mindfulness sessions, fitness boot camps, and nutritional workshops. Our holistic approach ensures that every employee gets access to resources that help them lead a healthy life.</p><br />

        <h3>Feedback</h3>
        <p className="paragraph">We love to hear from you! Our Recreation Activity page includes space for feedback, where you can provide your input about our past events and also suggest new activities. Your feedback is what keeps us always making improvements to what we offer and tailoring it specifically to you.</p><br />

        </div>

      <h2 className="center">Event Gallery</h2>
      <div className="ems-gallery">
        <div className=" ems-left">
        <ControlledCarousel /><br />
      
      <h2>1. Recreation Activity: 2023 Office Game</h2>
      <b>Description:</b> The Office Game of 2023 was one such huge success where the team came together and spent their time 
      in camaraderie by having fun. Employees enjoyed themselves gaming with cards, UNO, and even Codenames. 
      It provided a perfect chance for the bonding process to take place for the relaxation of the team members, 
      and they could witness the competitive spirits of individuals against each other in a very friendly atmosphere.<br /><br />

      <h2>2. Outdoor Activity: March 2023</h2>
      <b>Description:</b> In March 2023, we had a thrilling outdoor activity at Godrich Beach.
      It included a few beach games and activities that would emphasize team building and physical fitness. 
      Employees participated in competitions such as volleyball, beach soccer, and sandcastle building. 
      It was a day filled with sunshine and laughter.<br /><br />

      <h2>3. Community Service: April 2023</h2>
      <b>Description:</b> Our community service event in April 2023 was very fulfilling. Volunteers from our team gave their 
      time and energy to help a local shelter through donation sorting, meal preparation, and providing quality time with the 
      \shelter residents. This was a wonderful reminder of our responsibility to give back to the community for good.<br /><br />

      <h2>4. Team Building: May 2023</h2>
      <b>Description:</b> The team-building retreat in the middle of May 2023 had been such a life-changing event for every single
      soul present. The retreat was conducted in an absolutely serene setting and comprised different exercises and challenges to
        advance collaboration, communication, and problem solving. From trust falls down to group problems solved by the team itself, 
        this retreat assisted in growing much stronger relationships and bonding the common team spirit.<br /><br />

      <h2>5. Health and Wellness: June 2023</h2>
      <b>Description:</b> The Health and Wellness event conducted in June 2023 aimed at encouraging employees to live a fit and healthy life.
      This also included yoga classes and meditation sessions taken by professional instructors who taught techniques of stress management 
      and mental clarity. Healthy snacks and wellness workshops complemented the sessions for the overall well-being of our team.
      <RegistrationForm />
      </div>
      </div>
      </div>
      <div className="ems-clear"></div>
      <EmployeeFooter />
    </div>
  );
};

export default Recreation;

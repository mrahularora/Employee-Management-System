import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import BoardGamesComponent from "../components/BoardGamesComponent";
import EmployeeFooter from "../components/EmployeeFooter";

const BoardGames = () => {
    return (
      <div>
        <EmployeeHeader />
        <EmployeeNavigation />
        <div className="ems-clear"></div>
          <div className="ems-container game">
          <section className="ems-info-section">
            <div>
              <h2>Board games for team connection</h2>
              <p>
                Use these games as quick, low-cost activities for breaks,
                recreation days, onboarding sessions, or team-building events.
              </p>
            </div>
            <ul>
              <li>Pick short games for casual breaks.</li>
              <li>Use strategy games for collaboration and planning practice.</li>
              <li>Rotate games so different team members can participate.</li>
            </ul>
          </section>
          <BoardGamesComponent/>
          <hr className="hr" />
          </div>
          <div className="ems-clear"></div>
          <EmployeeFooter />
      </div>
    );
  };
  
  export default BoardGames;

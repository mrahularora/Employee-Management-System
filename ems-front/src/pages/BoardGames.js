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
          <BoardGamesComponent/>
          <hr className="hr" />
          </div>
          <div className="ems-clear"></div>
          <EmployeeFooter />
      </div>
    );
  };
  
  export default BoardGames;

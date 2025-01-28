import { Outlet } from "react-router-dom";
import { Dashboard } from "./Dashboard";

function LayOut(){
    return(
        <div>
            <Dashboard>
                <Outlet/>
            </Dashboard>    
        </div>
    )
}

export default LayOut;
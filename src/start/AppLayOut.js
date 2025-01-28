import { Outlet } from "react-router-dom";
import { MiniDrawer } from "../panel/components/features/MiniDrawer";

function AppLayOut(){
    return(
        <div>
            <MiniDrawer>
            <Outlet/>
            </MiniDrawer>    
        </div>
    )
}

export default AppLayOut;
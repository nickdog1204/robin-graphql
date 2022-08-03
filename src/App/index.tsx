import Profile from "../Profile";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './style.css';
import * as routes from "../constants/routes";
import Organization from "../Organization";
import Navigation from "./Navigation";

const App = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <Navigation/>

                <div className="App-main">
                    <Routes>
                        <Route
                            path={routes.ORGANIZATION}
                            element={
                                <div className="App-content_large-header">
                                    <Organization organizationName="the-road-to-learn-react"/>
                                </div>
                            }>
                        </Route>

                        <Route
                            path={routes.PROFILE}
                            element={
                                <div className="App-content_small-header">
                                    <Profile/>
                                </div>
                            }
                        />
                        <Route path="*" element={<p>No matching route</p>}/>


                    </Routes>

                </div>

            </div>
        </BrowserRouter>
    )
}
export default App;
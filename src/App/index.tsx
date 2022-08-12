import Profile from "../Profile";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import './style.css';
import * as routes from "../constants/routes";
import Organization from "../Organization";
import Navigation from "./Navigation";
import {useState} from "react";

const App = () => {
    const [organizationName, setOrganizationName] = useState('the-road-to-learn-react');
    const organizationSearchHandler = (organizationName: string) => {
        console.log({organizationName})
        setOrganizationName(organizationName);
    }
    return (
        <BrowserRouter>
            <div className="App">
                <Navigation
                    organizationName={organizationName}
                    onOrganizationSearch={organizationSearchHandler}/>

                <div className="App-main">
                    <Routes>
                        <Route
                            path={routes.ORGANIZATION}
                            element={
                                <div className="App-content_large-header">
                                    <Organization organizationName={organizationName}/>
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
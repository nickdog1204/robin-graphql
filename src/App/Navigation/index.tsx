import {FC} from "react";
import './style.css'
import {Link} from "react-router-dom";
import {ORGANIZATION, PROFILE} from "../../constants/routes";

const Navigation: FC = () => {
    return (
        <header className="Navigation">
            <div className="Navigation-link">
                <Link to={PROFILE}>Profile</Link>
            </div>
            <div className="Navigation-link">
                <Link to={ORGANIZATION}>Organization</Link>
            </div>
        </header>
    )

}

export default Navigation;
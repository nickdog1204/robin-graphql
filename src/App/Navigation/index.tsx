import {FC, PropsWithChildren, ReactElement, useState} from "react";
import './style.css'
import {Link, Location, useLocation} from "react-router-dom";
import {ORGANIZATION, PROFILE} from "../../constants/routes";
import OrganizationSearch from "../../OrganizationSearch";

export interface INavigationProps {
    // location: Location
    organizationName: string;
    onOrganizationSearch: (organizationName: string) => void;
}

export type NavigationFC = (it: PropsWithChildren<INavigationProps>) => ReactElement

const Navigation: NavigationFC = (
    {
        organizationName,
        onOrganizationSearch
    }
) => {
    const {pathname} = useLocation();
    const organizationSearchHandler = (organizationName: string) => {
        onOrganizationSearch(organizationName);
    }
    return (
        <header className="Navigation">
            <div className="Navigation-link">
                <Link to={PROFILE}>Profile</Link>
            </div>
            <div className="Navigation-link">
                <Link to={ORGANIZATION}>Organization</Link>
            </div>

            {pathname === ORGANIZATION && (
                <OrganizationSearch
                    organizationName={organizationName}
                    onOrganizationSearch={organizationSearchHandler}/>
            )}
        </header>
    )

}

export default Navigation;
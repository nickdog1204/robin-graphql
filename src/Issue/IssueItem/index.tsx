import {FC, PropsWithChildren, ReactElement} from "react";
import {IIssue} from "../../models";
import './style.css'
import Link from "../../Link";

export interface IIssueItemProps {
    issue: IIssue
}

export type IssueFC = (it: PropsWithChildren<IIssueItemProps>) => ReactElement;

const IssueItem: IssueFC = ({issue}) => {
    return (
        <div className="IssueItem">
            <div className="IssueItem-content">
                <h3>
                    <Link href={issue.url}>{issue.title}</Link>
                </h3>
                <div dangerouslySetInnerHTML={{__html: issue.bodyHTML}}/>
            </div>
        </div>
    )

}

export default IssueItem;
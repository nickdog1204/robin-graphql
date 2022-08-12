import {FormEvent, PropsWithChildren, ReactElement, useState} from "react";
import Input from "../Input";
import Button from "../Button";

export interface IOrganizationSearchProps {
    organizationName: string;
    onOrganizationSearch: (organizationName: string) => void

}

export type OrganizationSearchFC = (it: PropsWithChildren<IOrganizationSearchProps>) => ReactElement

const OrganizationSearch: OrganizationSearchFC = (
    {
        onOrganizationSearch,
        organizationName
    }
) => {
    const [value, setValue] = useState(organizationName);
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        onOrganizationSearch(value);
    }
    return (
        <div className="Navigation-search">
            <form onSubmit={submitHandler}>
                <Input color={'white'} value={value} onChange={setValue}/>{' '}
                <Button className={'okok'} onClick={() => {
                }} type={'submit'} color={'white'}>搜尋</Button>
            </form>
        </div>
    )
}

export default OrganizationSearch;
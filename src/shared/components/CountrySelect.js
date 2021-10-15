import {Select} from "mui-rff";
import {useMemo} from "react";
import countryList from "react-select-country-list";

export function CountrySelect(props){

    const countries = useMemo(() => countryList().getData(), []);

    return (
        <Select data={countries}
                {...props}
        />
    );
}


import countries from "world-countries";

const formattedCounties = countries.map((country) => country.name.common);

const useCountries = () => {
    
    return formattedCounties;
};

export default useCountries;

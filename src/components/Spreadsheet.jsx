import React from "react"
import { getCitiesInRange, getColor, getGradientColor, maximum, sumAttr, tierRanges } from "../utils";


function Row({coalition, maxTierSize, index}) {
    return <tr>
        <td style={{color: getColor(index)}}>{coalition.name}</td>
        <td>{coalition.totalNations}</td>
        <td>{coalition.totalCities}</td>
        {tierRanges.map(([minCities, maxCities], index) => {
            const tierSize = coalition[`${minCities}-${maxCities}`]
            return <td key={index} style={{ color: `${getGradientColor(tierSize, maxTierSize)}` }}>{tierSize}</td>
        })}
    </tr>
}


function Spreadsheet({coalitions, allianceData}) {
    let tierSizes = [];
    const coalitionData = coalitions.map(coalitionName => {
        const alliances = allianceData.filter(alliance => alliance.coalition === coalitionName)
        const totalCities = sumAttr(alliances, "totalCities");
        const cityDistribution = alliances.map(alliance => alliance.cityDistribution).flat().map(city => parseInt(city))
        let obj = {
            name: coalitionName,
            totalCities: totalCities,
            totalNations: cityDistribution.length
        }
        tierRanges.map(([minCities, maxCities]) => {
            const tierSize = getCitiesInRange(cityDistribution, minCities, maxCities);
            obj[`${minCities}-${maxCities}`] = tierSize;
            tierSizes.push(tierSize);
        })
        return obj
    })
    const maxTierSize = maximum(tierSizes);
    return <div style={{fontSize:"30px"}}>
        <table style={{border: "1px solid black", width:"100%"}}>
            <thead>
                <tr>
                    <th>Coalition</th>
                    <th>Total Nations</th>
                    <th>Total Cities</th>
                    <th>1-10</th>
                    <th>11-12</th>
                    <th>13-14</th>
                    <th>15-16</th>
                    <th>17-18</th>
                    <th>19-20</th>
                    <th>21-23</th>
                    <th>24-26</th>
                    <th>27-30</th>
                    <th>31-34</th>
                    <th>35-39</th>
                    <th>40-44</th>
                    <th>45+</th>
                </tr>
            </thead>
            <tbody>
                {coalitionData.map((coalition, index) => {
                    return <Row key={coalition.name} coalition={coalition} maxTierSize={maxTierSize} index={index}/>
                })}
            </tbody>
        </table>
    </div>
}

export default Spreadsheet;
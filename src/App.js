import "./App.css";
import Papa from 'papaparse';
import { useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Spreadsheet from "./components/Spreadsheet";
import { onlyUnique, sum, tierRanges } from "./utils";
import { ComparisonTieringChart, StackedTieringChart } from "./components/Graphs";



function Alliance({alliance}) {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'alliance',
        item: alliance,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })
    return <p ref={dragRef} style={{fontStyle: isDragging ? "italic" : "normal"}}>
        {alliance.name}
    </p>
}


function Coalition({coalitionName, allianceData, setAllianceData, selectedCoalitions, setSelectedCoalitions}) {
    const [{ isOver }, dropRef] = useDrop({
        accept: 'alliance',
        drop: (allianceElement) => {
            allianceElement.coalition = coalitionName
            let newAllianceData = [...allianceData.filter(allianceObj => allianceObj.name !== allianceElement.name), allianceElement]
            newAllianceData.sort((a, b) => a.name.localeCompare(b.name));
            setAllianceData(newAllianceData);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })
    const [checked, setChecked] = useState(true);

    return <div ref={dropRef} style={{ flexGrow: "1", border: "1px solid black", padding: "5px", backgroundColor: isOver ? "#D6D6D6" : "white" }}>
            <h2>
                {coalitionName}
                <input type="checkbox" checked={checked} onChange={e => {
                    if (checked === false) {
                        setSelectedCoalitions([...selectedCoalitions, coalitionName])
                        setChecked(!checked);
                    } else {
                        if (selectedCoalitions.length > 1) {
                            setSelectedCoalitions(selectedCoalitions.filter(name => name !== coalitionName))
                            setChecked(!checked);
                        } else {
                            console.log("Must have at least one selected coalition")
                        }
                    }
                    
                }}/>
            </h2>
            {allianceData.filter(alliance => alliance.coalition === coalitionName).map(alliance => {
                return <Alliance alliance={alliance} key={alliance.name} />
            })}
    </div>
}
  


function App() {
    const [allianceData, setAllianceData] = useState([]);

    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const fileUploaded = event => {
        Papa.parse(event.target.files[0], {
            header:true,
            skipEmptyLines:true,
            complete: function (results) {
                const data = results.data;
                const memberMin = allianceMemberMin.current.value ? parseInt(allianceMemberMin.current.value) : 0;
                const allianceNames = data
                    .map(nation => nation.alliance)
                    .filter(name => name !== "None")
                    .filter(onlyUnique)
                    .filter(allianceName => data
                        .filter(nation => nation.alliance === allianceName && parseInt(nation.alliance_position) >= 2).length > memberMin
                    )
                setAllianceData(allianceNames.map(allianceName => {
                    const members = data
                        .filter(nation => nation.alliance===allianceName)
                        .filter(nation => parseInt(nation.alliance_position) >= 2)
                    return {
                        name: allianceName,
                        coalition: "unsorted",
                        totalCities: members
                            .reduce((currentTotal, currentNation) => currentTotal + parseInt(currentNation.cities), 0),
                        cityDistribution: members.map(nation => nation.cities)
                    }
                }))
                setIsFileUploaded(true)
            }
        });
    };

    const [coalitions, setCoalitions] = useState(["unsorted"]);
    const [selectedCoalitions, setSelectedCoalitions] = useState(["unsorted"]);
    const coalitionInputRef = useRef(null);
    
    const allianceMemberMin = useRef(null);

    const fileInput = (
        <input
            type="file"
            name="file"
            accept=".csv"
            onChange={fileUploaded}
        />
    );

    const [displayFileInput, setDisplayFileInput] = useState(false);
    
    if (isFileUploaded === false) {
        return <div style={{ display: "block", margin: "10px auto", padding: "5px" }}>
            <input
                type="text"
                placeholder="Min Alliance Members"
                ref={allianceMemberMin}
                onChange={e => {
                    if (e.target.value !== "") {
                        setDisplayFileInput(true);
                    } else {
                        setDisplayFileInput(false);
                    }
                }}
            />
            {displayFileInput ? fileInput : <p>Please enter min alliance members</p>}
            <h2>How to Use</h2>
            <ol>
                <li>Above, enter the minimum number of alliance members required for an alliance to be displayed</li>
                <li>Go to <a target="_blank" href="https://politicsandwar.com/data/nations/" rel="noreferrer">https://politicsandwar.com/data/nations/</a></li>
                <li>Scroll to the bottom and click on the very last link/file to download it</li>
                <li>Extract the zip folder onto your computer</li>
                <li>Finally, click "Choose File" above and find the csv file that was inside the zip folder--it should be titled something like <i>nations-2022-08-15.csv</i><br/>
                    <u>note that the file ending in .zip will NOT work, it be the one ending in .csv</u></li>
            </ol>
        </div>
    }


    return (
        <div style={{padding: "5px"}}>
            <DndProvider backend={HTML5Backend}>

                <Spreadsheet allianceData={allianceData} coalitions={selectedCoalitions}/>
                <div>
                    <ComparisonTieringChart
                        coalitions={selectedCoalitions}
                        data={tierRanges.map(([minCities, maxCities]) => {
                            let obj = {
                                name: `${minCities}-${maxCities}`
                            }
                            selectedCoalitions.map(coalitionName => {
                                obj[coalitionName] = allianceData
                                    .filter(alliance => alliance.coalition === coalitionName)
                                    .map(alliance => alliance.cityDistribution)
                                    .flat()
                                    .filter(n => parseInt(n) >= minCities && parseInt(n) <= maxCities)
                                    .length;
                            })
                            return obj
                        })}
                    />
                    <StackedTieringChart
                        coalitions={selectedCoalitions}
                        data={tierRanges.map(([minCities, maxCities]) => {
                            let obj = {
                                name: `${minCities}-${maxCities}`
                            }
                            selectedCoalitions.map(coalitionName => {
                                obj[coalitionName] = allianceData
                                    .filter(alliance => alliance.coalition === coalitionName)
                                    .map(alliance => alliance.cityDistribution)
                                    .flat()
                                    .filter(n => parseInt(n) >= minCities && parseInt(n) <= maxCities)
                                    .length;
                            })
                            return obj
                        })}
                    />

                    <StackedTieringChart
                        coalitions={selectedCoalitions}
                        data={tierRanges.map(([minCities, maxCities]) => {
                            const totalSize = sum(selectedCoalitions.map(coalitionName => {
                                return allianceData
                                    .filter(alliance => alliance.coalition === coalitionName)
                                    .map(alliance => alliance.cityDistribution)
                                    .flat()
                                    .filter(n => parseInt(n) >= minCities && parseInt(n) <= maxCities)
                                    .length;
                            }))
                            let obj = {
                                name: `${minCities}-${maxCities}`
                            }
                            selectedCoalitions.map(coalitionName => {
                                obj[coalitionName] = totalSize > 0 ? 
                                    allianceData
                                        .filter(alliance => alliance.coalition === coalitionName)
                                        .map(alliance => alliance.cityDistribution)
                                        .flat()
                                        .filter(n => parseInt(n) >= minCities && parseInt(n) <= maxCities).length / totalSize
                                    : 0;
                            })
                            return obj
                        })}
                    />
                </div>
                <hr />
                <div style={{display: "flex", justifyContent: "center"}}>
                    <input
                        style={{fontSize: 18}}
                        type="text"
                        name="coalitionName"
                        id="coalitionName"
                        placeholder="Coalition Name"
                        ref={coalitionInputRef}
                    />
                    <input
                        style={{fontSize: 18}}
                        type="button"
                        name="addCoalition"
                        id="addCoalition"
                        value="add"
                        onClick={e => {
                            const name = coalitionInputRef.current.value;
                            if (coalitions.filter(coalitionName => coalitionName === name).length===0 && name !== "") {
                                setCoalitions([...coalitions, name])
                                setSelectedCoalitions([...selectedCoalitions, name])
                            } else {
                                console.log("Err: invalid coalition name")
                            }
                            coalitionInputRef.current.value = "";
                        }}
                    />
                    <input
                        style={{fontSize: 18}}
                        type="button"
                        name="removeCoalition"
                        id="removeCoalition"
                        value="remove"
                        onClick={e => {
                            const name = coalitionInputRef.current.value;
                            if (name !== "unsorted") {
                                setAllianceData(allianceData.map(alliance => {
                                    if (alliance.coalition === name) {
                                        alliance.coalition = "unsorted"
                                    }
                                    return alliance;
                                }))
                                setCoalitions(coalitions.filter(coalitionName => coalitionName !== name))
                                setSelectedCoalitions(selectedCoalitions.filter(coalitionName => coalitionName !== name))
                                coalitionInputRef.current.value = "";
                            }
                        }}
                    />
                </div>
                <h3 style={{textAlign: "center"}}>Drag and drop alliances to move them between coalitions</h3>

                <div style={{ display: "flex", justifyContent: "space-between"}}>
                    {coalitions.map((coalitionName, index) => {
                        return <Coalition
                            coalitionName={coalitionName}
                            key={index}
                            allianceData={allianceData}
                            setAllianceData={setAllianceData}
                            selectedCoalitions={selectedCoalitions}
                            setSelectedCoalitions={setSelectedCoalitions}
                        />
                    })}
                </div>
                
            </DndProvider>
        </div>
    );
}

export default App;

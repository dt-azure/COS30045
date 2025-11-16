const margin = { top: 30, right: 30, bottom: 50, left: 60 };
const numberFormatter = d3.format(",");

const defaultLineWidth = 2;
const defaultDotRadius = 4;

const colorMain = "#112D4E";
const colorBlue1 = "#3F72AF";
const colorBlue2 = "#DBE2EF";
const colorBlue3 = "#008DFF";
const colorGrey = "#767676";

const stateMap = {
  "NSW": "New South Wales",
  "VIC": "Victoria",
  "QLD": "Queensland",
  "WA": "Western Australia",
  "SA": "South Australia",
  "TAS": "Tasmania",
  "NT": "Northern Territory",
  "ACT": "Australian Capital Territory"
};

const ageOrder = ["0-16", "17-25", "26-39", "40-64", "65 and over"];

const ageColors = {
  "0-16": "#EA801C",
  "17-25": "#55A868",
  "26-39": "#C44E52",
  "40-64": "#8172B2",
  "65 and over": "#CCB974"
};

const ageColorMapping = d3.scaleOrdinal()
                          .domain(ageOrder)
                          .range(ageOrder.map(a => ageColors[a]));

const states = ["Overall", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

const stateColors = {
  "Overall": "#3F72AF",
  "NSW": "#55A868",
  "VIC": "#C44E52",
  "QLD": "#8172B2",
  "WA": "#CCB974",
  "SA": "#50AD9f",
  "TAS": "#EA801C",
  "NT": "#082A54",
  "ACT": "#FF8CA1"
};

const stateColorMapping = d3.scaleOrdinal()
                            .domain(states)
                            .range(states.map(a => stateColors[a]));

const offenceTypes = ["Mobile Phone Use", "Non-wearing Seatbelts", "Speeding", "Unlicensed Driving"];

const offenceTypeColors = {
  "Mobile Phone Use": "#3F72AF",
  "Non-wearing Seatbelts": "#55A868",
  "Speeding": "#C44E52",
  "Unlicensed Driving": "#008DFF"
};

const offenceTypeColorMapping = d3.scaleOrdinal()
                            .domain(offenceTypes)
                            .range(offenceTypes.map(a => offenceTypeColors[a]));

const detectionTypes = ["Police Issued", "Camera Detection", "Other"];

const detectionTypeColors = {
  "Police Issued": "#008DFF",
  "Camera Detection": "#EA801C",
  "Other": "#55A868"
}
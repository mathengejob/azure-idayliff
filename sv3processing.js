const data_indices_s3 = [
    [ //di
        1, 2, 3, 4, 6, 8, 9
    ],
    [//ai
        0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22
    ],
    [//do
        0, 1, 3, 4, 7, 8, 9, 11, 12, 13, 14, 15
    ],
    [//ao
        0, 1, 2, 3, 4, 5, 6
    ]
];
data_param= [
[//di
"U PHASE CURRENT SENSOR ERROR",
"W PHASE CURRENT SENSOR ERROR",
"DC CURRENT SENSOR ERROR",
"TANK LEVEL", 
"SOURCE LOW",
"INVERTER POWERED",
"PUMP STATUS"
],
[ //ai
"PV VOLTAGE (Total Vmp)",
"PV CURRENT (Imp)",
"PV POWER (Total)",
"AC OUTPUT VOLTAGE",
"AC OUTPUT CURRENT",
"PUMP OUTPUT FREQUENCY",
"MOTOR SPEED",
"DC BUS VOLTAGE",
"INVERTER TEMPERATURE",
"PUMP DAILY RUN HOURS",
"TOTAL ENERGY GENERATED 1",
"TOTAL ENERGY GENERATED 2",
"TODAYS PEAK POWER",
"INVERTER RATING (MODEL)",
"SOFTWARE VERSION",
"TANK LEVEL (meters)",
"SYSTEM PRESSURE",
"SYSTEM FLOW RATE",
"Pulse Count Upper Byte",
"Pulse Count Lower Byte"
],
[//do
"OVER VOLTAGE",
"LOW VOLTAGE",
"OVERLOAD",
"OVER CURRENT",
"LOSS LOAD",
"IPM PROTECTION",
"BOOST MODULE PROTECTION",
"TOO DARK ALARM",
"OUTPUT LOSS PHASE PROTECTION",
"OUTPUT LOSS/MOTOR CABLE ERROR",
"PROTECT FOR OVER HEAT",
"SPEEDING DOWN FOR OVERHEAT"
],
[//ao
"PUMP START/STOP",
"PUMP SPEED LIMIT",
"TANK LEVEL SWITCH SETTING",
"RESTART DELAY WHEN TANK FULL",
"WELL WATER LEVEL SWITCH SETTINGS",
"RESTART DELAY WHEN WELL RECHARGES",
"PUMP START DELAY"
]
];

const sample_payload = [
    {"data": "[768]"},
    {"data": "[546,2752,1502,314,399,4261,2556,552,521,256,84,2763,9,1688,37,222,768,0,0,0,0,0,0]"},
    {"data": "[0]"},
    {"data": "[0,2580,7,600,6,600,30]"}
];

const TABLE_NAME = 'site1'
console.log(`data_indices_s3 ${data_indices_s3}`);
console.log(`data: ${JSON.stringify(sample_payload)}`);

let diii_1 = [];
let diii_2 = [];
let diii_3 = [];
let diii_4 = [];

function data_cond_aii(payload) {
    diii_1 = payload[0]['data'];
    diii_1 = payload[0]['data'].slice(1, -1).split(',').map(String);
    diii_1[0] = parseInt(diii_1[0]).toString(2); // convert di to binary

    diii_2 = payload[1]['data'];
    diii_2 = payload[1]['data'].slice(1, -1).split(',').map(String);

    diii_3 = payload[2]['data'];
    diii_3 = payload[2]['data'].slice(1, -1).split(',').map(String);
    diii_3[0] = parseInt(diii_3[0]).toString(2); // convert do to binary

    diii_4 = payload[3]['data'];
    diii_4 = payload[3]['data'].slice(1, -1).split(',').map(String);
}

data_cond_aii(sample_payload);
let output_valueiii_0 = [];
let output_valueiii_1 = [];
let output_valueiii_2 = [];
let output_valueiii_3 = [];

try {
    for (let i = 0; i < data_indices_s3[0].length; i++) {
        output_valueiii_0.push(diii_1[0][data_indices_s3[0][i] - 1]);
        output_valueiii_0 = output_valueiii_0.map(Number);
    }

    for (let i = 0; i < data_indices_s3[1].length; i++) {
        output_valueiii_1.push(diii_2[data_indices_s3[1][i]]);
        output_valueiii_1 = output_valueiii_1.map(Number);
    }

    for (let i = 0; i < data_indices_s3[3].length; i++) {
        output_valueiii_3.push(diii_4[data_indices_s3[3][i]]);
        output_valueiii_3 = output_valueiii_3.map(Number);
    }

    const now = new Date();
    const formatted_now = now.toISOString().slice(0, 19).replace('T', ' ');

    const query_3 = `INSERT INTO ${TABLE_NAME} (
        "Time",
        "${data_param[0].join('", "')}",
        "${data_param[1].join('", "')}",
        "${data_param[3].join('", "')}"
    ) VALUES (
        ${formatted_now},
        ${output_valueiii_0.join(', ')},
        ${output_valueiii_1.join(', ')},
        ${output_valueiii_3.join(', ')}
    );`;

    console.log(query_3);
    return query_3;
} catch (e) {
    console.warn(e);
}

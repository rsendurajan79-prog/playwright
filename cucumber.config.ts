export default{
    "formatOptions": {
        "FORCE_COLOR": 1,
        "snippetInterface": "async-await"
    },
    paths:[
        "src/features/sample.feature",
    ],
    require:[
        "src/support/step-definitions/*.ts",
        
    ],
    publishQuiet: true,
    format: [
        "html:reports/cucumber-report.html",
        "json:reports/cucumber-report.json",
        "progress",
    ]  ,
    "requiredModules": [
        "ts-node/register"        
    ]

}
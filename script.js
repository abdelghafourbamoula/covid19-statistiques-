var ctx = document.getElementById('myChart');
var listCountries = document.getElementById("side");
let httpReq = new XMLHttpRequest();

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Morocco'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart(myChart,raw){
    let Labels = raw.map((e)=>{
        let d = new Date(e.Date);
        return `${d.getDate()}/${d.getMonth()+1}`;
    });
    let confirmed = raw.map((e)=>e.Confirmed);
    let recovered = raw.map((e)=>e.Recovred);
    let deaths = raw.map((e)=>e.Deaths);
    let active = raw.map((e)=>e.Active);

    let Datasets = [
        {
            label:"Confirmed",
            data: confirmed,
            borderColor: "#ff9c4bef"
        },
        {
            label: "Recovered",
            data: recovered,
            borderColor: "#3dff5def"
        },
        {
            label:"Deathes",
            data: deaths,
            borderColor: "#4b9fffef"
        },
        {
            label: "Active",
            data: active,
            borderColor: "#ff4b4bef"
        }
    ];

    myChart.data.labels = Labels;
    myChart.data.datasets = Datasets;
    myChart.options.plugins.title.text = raw[0].Country
    myChart.update();
    console.log(confirmed);
}

function Clicked(e){
    if(e == null) targ = "MA";
    else targ = e.target.getAttribute("id");
    httpReq.open("GET","https://api.covid19api.com/dayone/country/"+targ,true)
    httpReq.onreadystatechange = ()=>{
        if(httpReq.readyState == 4 && httpReq.status == 200){
            let raw = JSON.parse(httpReq.response);
            updateChart(myChart, raw);
        }
    }
    httpReq.send()
}


httpReq.open("GET", "https://api.covid19api.com/countries", true);
httpReq.onreadystatechange = (e)=>{
    if(httpReq.readyState == 4 && httpReq.status == 200){
        let resp = JSON.parse(httpReq.response);
        resp = resp.sort((a,b)=> a.Country>b.Country?1:-1)
        resp.forEach(e => {
            let country = document.createElement("div");
            country.setAttribute("id",e.ISO2)
            country.setAttribute("class", "country");
            country.innerHTML = e.Country; 
            listCountries.appendChild(country);
            country.addEventListener("click",Clicked);
        });
        Clicked();
    }
}


httpReq.send()


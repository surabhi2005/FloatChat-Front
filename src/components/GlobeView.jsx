import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GlobeView = () => {
  const mountRef = useRef(null);
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [floatsData, setFloatsData] = useState([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFloats, setFilteredFloats] = useState([]);
  // Deep-dive table filters
  const [tableFilterSystem, setTableFilterSystem] = useState('all');
  const [tableFilterProject, setTableFilterProject] = useState('all');
  const [tableFilterPI, setTableFilterPI] = useState('');

  // Your complete data string would go here
  const dataStrings = `{"profile_index":0,"LATITUDE":-15.989618333333333,"LONGITUDE":90.30670166666668,"JULD":1756770920000,"JULD_LOCATION":1756771895000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905529,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":1,"LATITUDE":-43.037,"LONGITUDE":130.202,"JULD":1756769479000,"JULD_LOCATION":1756773668000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"IRIDIUM","DIRECTION":"A","PLATFORM_NUMBER":5906256,"PROJECT_NAME":"UW, Argo","PI_NAME":"STEPHEN RISER"}
{"profile_index":2,"LATITUDE":-41.369305,"LONGITUDE":142.676725,"JULD":1756769160000,"JULD_LOCATION":1756769813000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905553,"PROJECT_NAME":"Argo Australia","PI_NAME":"Christina SCHALLENBERG"}
{"profile_index":3,"LATITUDE":-54.2695,"LONGITUDE":47.7197,"JULD":1756768920000,"JULD_LOCATION":1756769850000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902491,"PROJECT_NAME":"GO-BGC, WHOI","PI_NAME":"DAVID NICHOLSON, SUSAN WIJFFELS"}
{"profile_index":4,"LATITUDE":-18.76391,"LONGITUDE":85.08059,"JULD":1756768740000,"JULD_LOCATION":1756768740000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5902490,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":5,"LATITUDE":-10.007263333333333,"LONGITUDE":55.47308666666667,"JULD":1756767980000,"JULD_LOCATION":1756768979000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6903148,"PROJECT_NAME":"Argo-France","PI_NAME":"Vincent TAILLANDIER"}
{"profile_index":6,"LATITUDE":-50.910943333333336,"LONGITUDE":22.70258,"JULD":1756767020000,"JULD_LOCATION":1756768430000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":7900575,"PROJECT_NAME":"Argo BSH","PI_NAME":"Birgit KLEIN"}
{"profile_index":7,"LATITUDE":22.215215,"LONGITUDE":62.07953666666667,"JULD":1756766900000,"JULD_LOCATION":1756767898000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902734,"PROJECT_NAME":"OxuMAS","PI_NAME":"Jean Batiste Roustan"}
{"profile_index":8,"LATITUDE":-41.80765333333333,"LONGITUDE":91.09458,"JULD":1756766120000,"JULD_LOCATION":1756767115000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6904072,"PROJECT_NAME":"Argo BSH","PI_NAME":"Birgit KLEIN"}
{"profile_index":9,"LATITUDE":-39.04787666666667,"LONGITUDE":91.62685833333332,"JULD":1756763250000,"JULD_LOCATION":1756764262000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903768,"PROJECT_NAME":"Argo-France","PI_NAME":"Christine COATANOAN"}
{"profile_index":10,"LATITUDE":-3.7463,"LONGITUDE":75.0129,"JULD":1756763118000,"JULD_LOCATION":1756764790000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902453,"PROJECT_NAME":"GO-BGC, WHOI","PI_NAME":"DAVID NICHOLSON, SUSAN WIJFFELS"}
{"profile_index":11,"LATITUDE":-57.96851,"LONGITUDE":124.14634166666669,"JULD":1756763010000,"JULD_LOCATION":1756764003000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":3902459,"PROJECT_NAME":"Argo-France","PI_NAME":"Christine COATANOAN"}
{"profile_index":12,"LATITUDE":-25.60761,"LONGITUDE":86.78531,"JULD":1756761302000,"JULD_LOCATION":1756761540000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906141,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":13,"LATITUDE":9.28045,"LONGITUDE":52.70461,"JULD":1756759831000,"JULD_LOCATION":1756759860000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903137,"PROJECT_NAME":"Argo WHOI","PI_NAME":"SUSAN WIJFFELS, STEVEN JAYNE, PELLE ROBBINS"}
{"profile_index":14,"LATITUDE":-5.81596,"LONGITUDE":95.4933,"JULD":1756758853000,"JULD_LOCATION":1756758840000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903139,"PROJECT_NAME":"Argo WHOI","PI_NAME":"SUSAN WIJFFELS, STEVEN JAYNE, PELLE ROBBINS"}
{"profile_index":15,"LATITUDE":-63.15085999999997,"LONGITUDE":135.87459567010305,"JULD":1756757940000,"JULD_LOCATION":1756759775000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"IRIDIUM","DIRECTION":"A","PLATFORM_NUMBER":7900515,"PROJECT_NAME":"ARGO-BSH","PI_NAME":"Birgit KLEIN"}
{"profile_index":16,"LATITUDE":-36.763525,"LONGITUDE":121.39689,"JULD":1756755200000,"JULD_LOCATION":1756756203000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905584,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":17,"LATITUDE":5.4722,"LONGITUDE":83.9987,"JULD":1756751869000,"JULD_LOCATION":1756752660000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902198,"PROJECT_NAME":"Argo PMEL","PI_NAME":"GREGORY C. JOHNSON"}
{"profile_index":18,"LATITUDE":-37.2255,"LONGITUDE":32.8432,"JULD":1756751855000,"JULD_LOCATION":1756752720000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1901754,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":19,"LATITUDE":-39.84902,"LONGITUDE":109.44548,"JULD":1756751144000,"JULD_LOCATION":1756751520000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5902485,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":20,"LATITUDE":-39.2899,"LONGITUDE":136.3874,"JULD":1756749624000,"JULD_LOCATION":1756751430000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905401,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":21,"LATITUDE":-18.00281,"LONGITUDE":104.7825,"JULD":1756747871000,"JULD_LOCATION":1756748100000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902055,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH, SARAH PURKEY, NATHALIE ZILBERMAN, JOHN GILSON"}
{"profile_index":22,"LATITUDE":20.689844166666667,"LONGITUDE":62.36897283333333,"JULD":1756747222000,"JULD_LOCATION":1756748831000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902751,"PROJECT_NAME":"GMMC OXUMAS","PI_NAME":"Vincent Taillandier"}
{"profile_index":23,"LATITUDE":-43.05,"LONGITUDE":73.03333333333333,"JULD":1756745960000,"JULD_LOCATION":1756745960000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":4903876,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":24,"LATITUDE":-27.00831,"LONGITUDE":101.73323,"JULD":1756745958000,"JULD_LOCATION":1756746240000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906142,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":25,"LATITUDE":-10.7063,"LONGITUDE":58.8793,"JULD":1756745859000,"JULD_LOCATION":1756746710000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906537,"PROJECT_NAME":"UW, SOCCOM, Argo equivalent","PI_NAME":"STEPHEN RISER/KEN JOHNSON"}
{"profile_index":26,"LATITUDE":-34.87821,"LONGITUDE":40.39435,"JULD":1756743989000,"JULD_LOCATION":1756744260000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902043,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":27,"LATITUDE":-21.33873,"LONGITUDE":102.72258,"JULD":1756740970000,"JULD_LOCATION":1756741260000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5902489,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":28,"LATITUDE":-41.863258361816406,"LONGITUDE":58.99813461303711,"JULD":1756738740000,"JULD_LOCATION":1756738878000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":4902657,"PROJECT_NAME":"Argo Canada","PI_NAME":"Blair Greenan"}
{"profile_index":29,"LATITUDE":1.35,"LONGITUDE":88.46666666666667,"JULD":1756736027000,"JULD_LOCATION":1756736027000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903954,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":30,"LATITUDE":-10.933333333333334,"LONGITUDE":63.8,"JULD":1756735731000,"JULD_LOCATION":1756735731000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6990615,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":31,"LATITUDE":-5.6,"LONGITUDE":79.71666666666667,"JULD":1756735375000,"JULD_LOCATION":1756735375000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902674,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":32,"LATITUDE":9.9,"LONGITUDE":86.78333333333333,"JULD":1756735249000,"JULD_LOCATION":1756735249000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6990609,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":33,"LATITUDE":2.6833333333333336,"LONGITUDE":86.2,"JULD":1756735181000,"JULD_LOCATION":1756735181000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5907138,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":34,"LATITUDE":9.85,"LONGITUDE":91.13333333333334,"JULD":1756735071000,"JULD_LOCATION":1756735071000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":7901127,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":35,"LATITUDE":6.65,"LONGITUDE":87.91666666666667,"JULD":1756735053000,"JULD_LOCATION":1756735053000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6990705,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":36,"LATITUDE":-34.6014,"LONGITUDE":73.0206,"JULD":1756734500000,"JULD_LOCATION":1756735440000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1901740,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":37,"LATITUDE":6.76455,"LONGITUDE":86.63142,"JULD":1756734080000,"JULD_LOCATION":1756735086000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":4903794,"PROJECT_NAME":"Argo GERMANY","PI_NAME":"Birgit KLEIN"}
{"profile_index":38,"LATITUDE":-28.17834,"LONGITUDE":61.78259,"JULD":1756733753000,"JULD_LOCATION":1756734000000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902258,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH, SARAH PURKEY, NATHALIE ZILBERMAN, JOHN GILSON"}
{"profile_index":39,"LATITUDE":1.623,"LONGITUDE":44.638,"JULD":1756733047000,"JULD_LOCATION":1756735972000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"ARGOS","DIRECTION":"A","PLATFORM_NUMBER":1901514,"PROJECT_NAME":"US ARGO PROJECT","PI_NAME":"GREGORY C. JOHNSON"}
{"profile_index":40,"LATITUDE":14.517951666666669,"LONGITUDE":58.61337666666667,"JULD":1756730970000,"JULD_LOCATION":1756731972000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":7901016,"PROJECT_NAME":"CORIOLIS","PI_NAME":"Christine COATANOAN"}
{"profile_index":41,"LATITUDE":3.7272,"LONGITUDE":63.3935,"JULD":1756730701000,"JULD_LOCATION":1756731630000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902286,"PROJECT_NAME":"Argo PMEL","PI_NAME":"GREGORY C. JOHNSON"}
{"profile_index":42,"LATITUDE":-8.612825,"LONGITUDE":68.46361166666667,"JULD":1756730370000,"JULD_LOCATION":1756731385000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903775,"PROJECT_NAME":"CORIOLIS","PI_NAME":"Christine COATANOAN"}
{"profile_index":43,"LATITUDE":-24.82447,"LONGITUDE":38.24111,"JULD":1756730078000,"JULD_LOCATION":1756730100000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902417,"PROJECT_NAME":"Argo WHOI","PI_NAME":"SUSAN WIJFFELS, STEVEN JAYNE, PELLE ROBBINS"}
{"profile_index":44,"LATITUDE":11.85,"LONGITUDE":67.98333333333333,"JULD":1756728385000,"JULD_LOCATION":1756728385000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5907179,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":45,"LATITUDE":-50.51810073852539,"LONGITUDE":117.76588439941406,"JULD":1756728350000,"JULD_LOCATION":1756734381000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906651,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":46,"LATITUDE":-41.7959,"LONGITUDE":117.97926,"JULD":1756728070000,"JULD_LOCATION":1756728720000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906148,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH, SARAH PURKEY, NATHALIE ZILBERMAN, JOHN GILSON"}
{"profile_index":47,"LATITUDE":-31.085101666666667,"LONGITUDE":105.55264666666666,"JULD":1756727000000,"JULD_LOCATION":1756727965000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905599,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":48,"LATITUDE":-0.637,"LONGITUDE":91.029,"JULD":1756726370000,"JULD_LOCATION":1756726370000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2902777,"PROJECT_NAME":"CHINA ARGO EQUIVALENT","PI_NAME":"FENG ZHOU"}
{"profile_index":49,"LATITUDE":-23.82131,"LONGITUDE":97.62443,"JULD":1756725410000,"JULD_LOCATION":1756725420000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903432,"PROJECT_NAME":"Argo WHOI","PI_NAME":"SUSAN WIJFFELS, STEVEN JAYNE, PELLE ROBBINS"}
{"profile_index":50,"LATITUDE":15.058488333333331,"LONGITUDE":54.027945,"JULD":1756719080000,"JULD_LOCATION":1756720138000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902756,"PROJECT_NAME":"TRANSIT PHYSINDIEN","PI_NAME":"Stephanie Correard"}
{"profile_index":51,"LATITUDE":-44.931111666666666,"LONGITUDE":37.94669,"JULD":1756717770000,"JULD_LOCATION":1756718800000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6901987,"PROJECT_NAME":"Argo NETHERLANDS","PI_NAME":"Andreas STERL"}
{"profile_index":52,"LATITUDE":22,"LONGITUDE":66.86666666666666,"JULD":1756716713000,"JULD_LOCATION":1756716713000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6990611,"PROJECT_NAME":"Argo INDIA","PI_NAME":"M Ravichandran"}
{"profile_index":53,"LATITUDE":-3.10591,"LONGITUDE":88.2196,"JULD":1756716551000,"JULD_LOCATION":1756716780000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902624,"PROJECT_NAME":"Argo SIO","PI_NAME":"SARAH PURKEY, DEAN ROEMMICH, NATHALIE ZILBERMAN, JOHN GILSON"}
{"profile_index":54,"LATITUDE":-25.38884,"LONGITUDE":53.35493,"JULD":1756714910000,"JULD_LOCATION":1756715160000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902038,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":55,"LATITUDE":-27.516,"LONGITUDE":62.839,"JULD":1756709120000,"JULD_LOCATION":1756709880000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906275,"PROJECT_NAME":"UW, Argo","PI_NAME":"STEPHEN RISER"}
{"profile_index":56,"LATITUDE":-40.8211,"LONGITUDE":91.079,"JULD":1756709017000,"JULD_LOCATION":1756709017000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1901924,"PROJECT_NAME":"Argo UK","PI_NAME":"Jon Turton"}
{"profile_index":57,"LATITUDE":-46.42548,"LONGITUDE":113.07505,"JULD":1756706890000,"JULD_LOCATION":1756706940000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902297,"PROJECT_NAME":"Argo WHOI","PI_NAME":"SUSAN WIJFFELS, STEVEN JAYNE, PELLE ROBBINS"}
{"profile_index":58,"LATITUDE":-60.65006833333333,"LONGITUDE":134.66207666666668,"JULD":1756704500000,"JULD_LOCATION":1756705522000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905591,"PROJECT_NAME":"Argo Australia","PI_NAME":"Peter OKE"}
{"profile_index":59,"LATITUDE":-33.08548,"LONGITUDE":39.38166,"JULD":1756703943000,"JULD_LOCATION":1756703940000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902276,"PROJECT_NAME":"Argo WHOI","PI_NAME":"SUSAN WIJFFELS, STEVEN JAYNE, PELLE ROBBINS"}
{"profile_index":60,"LATITUDE":-16.86483,"LONGITUDE":104.49009,"JULD":1756701549000,"JULD_LOCATION":1756701840000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":1902050,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH, SARAH PURKEY, NATHALIE ZILBERMAN, JOHN GILSON"}
{"profile_index":61,"LATITUDE":0.439,"LONGITUDE":78.5536,"JULD":1756700071000,"JULD_LOCATION":1756700890000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5907107,"PROJECT_NAME":"Argo PMEL","PI_NAME":"GREGORY C. JOHNSON"}
{"profile_index":62,"LATITUDE":-41.653128333333335,"LONGITUDE":42.78982,"JULD":1756698560000,"JULD_LOCATION":1756699584000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906988,"PROJECT_NAME":"Argo Germany","PI_NAME":"Birgit KLEIN"}
{"profile_index":63,"LATITUDE":-44.7561,"LONGITUDE":138.0386,"JULD":1756695884000,"JULD_LOCATION":1756697210000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":7902149,"PROJECT_NAME":"UW, SOCCOM, Argo equivalent","PI_NAME":"STEPHEN RISER/KEN JOHNSON"}
{"profile_index":64,"LATITUDE":22.851356666666668,"LONGITUDE":60.49283333333333,"JULD":1756695440000,"JULD_LOCATION":1756696423000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":2903956,"PROJECT_NAME":"OxUMAS","PI_NAME":"Jean Batiste Roustan"}
{"profile_index":65,"LATITUDE":-18.57051,"LONGITUDE":85.24222,"JULD":1756694220000,"JULD_LOCATION":1756694220000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5902490,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":66,"LATITUDE":-39.21718,"LONGITUDE":130.93317,"JULD":1756691515000,"JULD_LOCATION":1756691940000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906394,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
{"profile_index":67,"LATITUDE":1.2592,"LONGITUDE":92.4174,"JULD":1756689419000,"JULD_LOCATION":1756689419000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"ARGOS","DIRECTION":"A","PLATFORM_NUMBER":1901910,"PROJECT_NAME":"Argo UK","PI_NAME":"Jon Turton"}
{"profile_index":68,"LATITUDE":-1.443,"LONGITUDE":63.0806,"JULD":1756688859000,"JULD_LOCATION":1756689600000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":4903864,"PROJECT_NAME":"Argo PMEL","PI_NAME":"GREGORY C. JOHNSON"}
{"profile_index":69,"LATITUDE":-46.19752,"LONGITUDE":62.648685,"JULD":1756687470000,"JULD_LOCATION":1756688455000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6903051,"PROJECT_NAME":"GMMC BACI","PI_NAME":"Christine PROVOST"}
{"profile_index":70,"LATITUDE":-30.182,"LONGITUDE":65.23,"JULD":1756687374000,"JULD_LOCATION":1756688630000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906500,"PROJECT_NAME":"UW, SOCCOM","PI_NAME":"STEPHEN RISER/KEN JOHNSON"}
{"profile_index":71,"LATITUDE":-39.83466333333333,"LONGITUDE":22.440781666666663,"JULD":1756686500000,"JULD_LOCATION":1756687453000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":6904138,"PROJECT_NAME":"Argo Germany","PI_NAME":"Birgit KLEIN"}
{"profile_index":72,"LATITUDE":-53.813325,"LONGITUDE":33.06234166666667,"JULD":1756685780000,"JULD_LOCATION":1756686991000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":7900565,"PROJECT_NAME":"Argo BSH","PI_NAME":"Birgit KLEIN"}
{"profile_index":73,"LATITUDE":-55.07567683333333,"LONGITUDE":133.90435816666667,"JULD":1756685652000,"JULD_LOCATION":1756687256000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5905597,"PROJECT_NAME":"Argo Australia","PI_NAME":"Christina SCHALLENBERG"}
{"profile_index":74,"LATITUDE":-38.42799,"LONGITUDE":130.74161,"JULD":1756685192000,"JULD_LOCATION":1756685580000,"REFERENCE_DATE_TIME":-631152000000,"POSITION_QC":1,"POSITIONING_SYSTEM":"GPS","DIRECTION":"A","PLATFORM_NUMBER":5906395,"PROJECT_NAME":"Argo SIO","PI_NAME":"DEAN ROEMMICH"}
`;

  useEffect(() => {
    // Parse the provided data
    const parsedData = dataStrings.split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line.trim()));
    
    setFloatsData(parsedData);
    setFilteredFloats(parsedData);
  }, []);

  useEffect(() => {
    if (floatsData.length === 0) return;

    const results = floatsData.filter(float => 
      float.PLATFORM_NUMBER.toString().includes(searchTerm) ||
      float.PROJECT_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      float.PI_NAME.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFloats(results);
  }, [searchTerm, floatsData]);

  // Helpers for deep-dive filters
  const uniqueSystems = Array.from(new Set(floatsData.map(f => f.POSITIONING_SYSTEM))).filter(Boolean);
  const uniqueProjects = Array.from(new Set(floatsData.map(f => f.PROJECT_NAME))).filter(Boolean);

  const tableRows = floatsData
    .filter(f => tableFilterSystem === 'all' || f.POSITIONING_SYSTEM === tableFilterSystem)
    .filter(f => tableFilterProject === 'all' || f.PROJECT_NAME === tableFilterProject)
    .filter(f => tableFilterPI.trim() === '' || (f.PI_NAME || '').toLowerCase().includes(tableFilterPI.toLowerCase()))
    .slice(0, 75);

  const exportTableCSV = () => {
    const esc = (s) => '"' + String(s || '').replace(/"/g, '""') + '"';
    const headers = ['index','platform','profile','latitude','longitude','positioning','project','pi','juld','juld_location'];
    const lines = [headers.join(',')];
    tableRows.forEach((f, i) => {
      const row = [
        i + 1,
        f.PLATFORM_NUMBER,
        f.profile_index,
        Number(f.LATITUDE).toFixed(4),
        Number(f.LONGITUDE).toFixed(4),
        f.POSITIONING_SYSTEM,
        esc(f.PROJECT_NAME),
        esc(f.PI_NAME),
        new Date(f.JULD).toISOString(),
        new Date(f.JULD_LOCATION).toISOString()
      ];
      lines.push(row.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'floats_75.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (floatsData.length === 0) return;

    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create Earth - increased size
    const earthGeometry = new THREE.SphereGeometry(9, 64, 64);
    const earthTexture = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: earthTexture,
      specular: new THREE.Color(0x333333),
      shininess: 5
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Latitude/Longitude grid
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x3a3a3a, transparent: true, opacity: 0.6 });
    const boldMaterial = new THREE.LineBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.9 });

    const addLatitude = (latDeg, material) => {
      const lat = THREE.MathUtils.degToRad(latDeg);
      const points = [];
      const r = 9.001; // slightly above surface to avoid z-fighting
      for (let lon = 0; lon <= 360; lon += 2) {
        const phi = (90 - THREE.MathUtils.radToDeg(lat)) * (Math.PI / 180);
        const theta = THREE.MathUtils.degToRad(lon + 180);
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));
        points.push(new THREE.Vector3(x, y, z));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, material);
      gridGroup.add(line);
    };

    const addLongitude = (lonDeg, material) => {
      const lon = THREE.MathUtils.degToRad(lonDeg);
      const points = [];
      const r = 9.001;
      for (let lat = -89; lat <= 89; lat += 2) {
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(THREE.MathUtils.radToDeg(lon) + 180);
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));
        points.push(new THREE.Vector3(x, y, z));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, material);
      gridGroup.add(line);
    };

    // Regular grid every 15°
    for (let lat = -75; lat <= 75; lat += 15) addLatitude(lat, gridMaterial);
    for (let lon = -180; lon < 180; lon += 15) addLongitude(lon, gridMaterial);
    // Bold Equator and Prime Meridian
    addLatitude(0, boldMaterial);
    addLongitude(0, boldMaterial);
    scene.add(gridGroup);

    // Add clouds
    const cloudGeometry = new THREE.SphereGeometry(9.2, 64, 64);
    const cloudTexture = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-clouds.png');
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // Create atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(9.3, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.scale.set(1.1, 1.1, 1.1);
    scene.add(atmosphere);

    // Create float markers
    const floatGroup = new THREE.Group();
    const floatMeshes = [];
    
    floatsData.forEach((data, index) => {
      const { LATITUDE, LONGITUDE } = data;
      
      // Convert lat/long to 3D position
      const phi = (90 - LATITUDE) * (Math.PI / 180);
      const theta = (LONGITUDE + 180) * (Math.PI / 180);
      
      const radius = 9.3;
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.userData = { floatData: data, index };

      // Add a small radial line (spike) above the marker
      const spikeGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(x * 1.03, y * 1.03, z * 1.03)
      ]);
      const spike = new THREE.Line(spikeGeom, new THREE.LineBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.8 }));
      
      // Add pulsing animation
      const pulseGeometry = new THREE.SphereGeometry(0.18, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.5
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.position.set(x, y, z);
      pulse.userData = { growing: true, scale: 0.18 };
      
      floatGroup.add(marker);
      floatGroup.add(pulse);
      floatGroup.add(spike);
      floatMeshes.push({ marker, pulse });
    });
    
    scene.add(floatGroup);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 12;
    controls.maxDistance = 40;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;

    // Set camera position
    camera.position.z = 26;

    // Add stars background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate Earth slowly
      if (autoRotate) {
        earth.rotation.y += 0.0005;
        clouds.rotation.y += 0.0007;
      }
      
      // Animate pulse markers
      floatMeshes.forEach(({ pulse }) => {
        if (pulse.userData.growing) {
          pulse.scale.x += 0.01;
          pulse.scale.y += 0.01;
          pulse.scale.z += 0.01;
          pulse.material.opacity -= 0.01;
          
          if (pulse.scale.x > 1.5) {
            pulse.userData.growing = false;
          }
        } else {
          pulse.scale.x -= 0.01;
          pulse.scale.y -= 0.01;
          pulse.scale.z -= 0.01;
          pulse.material.opacity += 0.01;
          
          if (pulse.scale.x <= 0.18) {
            pulse.userData.growing = true;
          }
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle click events
    const onMouseClick = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(floatGroup.children, true);
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.floatData) {
          setSelectedFloat(clickedObject.userData.floatData);
        }
      }
    };
    
    renderer.domElement.addEventListener('click', onMouseClick);

    // Hover tooltip
    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(floatGroup.children, true);
      const hit = intersects.find(i => i.object.userData && i.object.userData.floatData);
      if (hit) {
        const d = hit.object.userData.floatData;
        setHoverInfo({
          data: d,
          x: event.clientX,
          y: event.clientY
        });
      } else {
        setHoverInfo(null);
      }
    };
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Handle window resize
    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
        if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
    mountRef.current.removeChild(renderer.domElement);
  }
  
  // Dispose of Three.js resources
  renderer.dispose();
    };
  }, [floatsData]);

  // Format date from timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleFloatSelect = (float) => {
    setSelectedFloat(float);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(floatsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'argo_floats_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex flex-col h-screen text-white bg-black">
      {/* Title only, no bar */}
      <div className="py-4 flex justify-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-white text-center">OCEAN GLOBAL VIEW</h1>
      </div>
      
      <div className="flex-1">
        {/* Globe area */}
        <div ref={mountRef} className="w-full h-[70vh]" />

        {/* Content directly below globe (compact tools) */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-black/95 border border-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white">Float Explorer (Horizontal)</h2>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search floats..."
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded pl-8 text-white placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <table className="w-full text-xs text-left table-fixed border border-gray-800">
                <colgroup>
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '32%' }} />
                </colgroup>
                <thead className="bg-black/70">
                  <tr className="text-gray-300">
                    <th className="px-2 py-1 border border-gray-800">Platform</th>
                    <th className="px-2 py-1 border border-gray-800">Profile</th>
                    <th className="px-2 py-1 border border-gray-800">Project</th>
                    <th className="px-2 py-1 border border-gray-800">PI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFloats.map((float, index) => (
                    <tr 
                      key={index}
                      className={`text-gray-200 cursor-pointer ${selectedFloat && selectedFloat.profile_index === float.profile_index ? 'bg-gray-700' : 'bg-black/40'} hover:bg-gray-800`}
                      onClick={() => handleFloatSelect(float)}
                    >
                      <td className="px-2 py-1 border border-gray-800 font-mono whitespace-nowrap">{float.PLATFORM_NUMBER}</td>
                      <td className="px-2 py-1 border border-gray-800 whitespace-nowrap">{float.profile_index}</td>
                      <td className="px-2 py-1 border border-gray-800 overflow-hidden"><span className="block truncate" title={float.PROJECT_NAME}>{float.PROJECT_NAME}</span></td>
                      <td className="px-2 py-1 border border-gray-800 overflow-hidden"><span className="block truncate" title={float.PI_NAME}>{float.PI_NAME}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 bg-black/95 border border-gray-800 p-4 rounded">
            {selectedFloat ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Float Details</h2>
                  <button 
                    onClick={() => setSelectedFloat(null)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="text-gray-400 text-sm">Platform Number</div>
                      <div className="font-mono text-lg text-white">{selectedFloat.PLATFORM_NUMBER}</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="text-gray-400 text-sm">Profile Index</div>
                      <div className="text-lg text-white">{selectedFloat.profile_index}</div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                    <div className="text-gray-400 text-sm">Coordinates</div>
                    <div className="text-lg text-white">
                      {selectedFloat.LATITUDE.toFixed(4)}°N, {selectedFloat.LONGITUDE.toFixed(4)}°E
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="text-gray-400 text-sm">Date/Time</div>
                      <div className="text-white">{formatDate(selectedFloat.JULD)}</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="text-gray-400 text-sm">Location Date/Time</div>
                      <div className="text-white">{formatDate(selectedFloat.JULD_LOCATION)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="text-gray-400 text-sm">Positioning System</div>
                      <div className="text-white">{selectedFloat.POSITIONING_SYSTEM}</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="text-gray-400 text-sm">Direction</div>
                      <div className="text-white">{selectedFloat.DIRECTION}</div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                    <div className="text-gray-400 text-sm">Project</div>
                    <div className="text-white">{selectedFloat.PROJECT_NAME}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                    <div className="text-gray-400 text-sm">Principal Investigator</div>
                    <div className="text-white">{selectedFloat.PI_NAME}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Select a float from the list to view details.</div>
            )}
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setAutoRotate(!autoRotate)}
                className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300"
              >
                {autoRotate ? 'Pause Rotate' : 'Auto Rotate'}
              </button>
              <button 
                onClick={exportData}
                className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Deep-dive section further down the page */}
        <section className="mt-6 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Fleet summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black/80 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Total Floats Loaded</div>
                <div className="text-2xl text-white font-bold">{floatsData.length}</div>
              </div>
              <div className="bg-black/80 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm">GPS / IRIDIUM / ARGOS</div>
                <div className="text-white font-medium">
                  {floatsData.filter(f => f.POSITIONING_SYSTEM === 'GPS').length} / {floatsData.filter(f => f.POSITIONING_SYSTEM === 'IRIDIUM').length} / {floatsData.filter(f => f.POSITIONING_SYSTEM === 'ARGOS').length}
                </div>
              </div>
              <div className="bg-black/80 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Projects (unique)</div>
                <div className="text-white font-medium">{Array.from(new Set(floatsData.map(f => f.PROJECT_NAME))).length}</div>
              </div>
            </div>

            {/* 75-float interactive table */}
            <div className="bg-black/90 border border-gray-800 rounded-xl">
              <div className="px-4 py-3 border-b border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-white text-lg font-semibold">Interactive Float Data (75)</h2>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1"
                    value={tableFilterSystem}
                    onChange={e => setTableFilterSystem(e.target.value)}
                    title="Filter by positioning system"
                  >
                    <option value="all">All Systems</option>
                    {uniqueSystems.map(sys => (
                      <option key={sys} value={sys}>{sys}</option>
                    ))}
                  </select>
                  <select
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1 max-w-[16rem]"
                    value={tableFilterProject}
                    onChange={e => setTableFilterProject(e.target.value)}
                    title="Filter by project"
                  >
                    <option value="all">All Projects</option>
                    {uniqueProjects.map(proj => (
                      <option key={proj} value={proj}>{proj}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Filter PI..."
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1"
                    value={tableFilterPI}
                    onChange={e => setTableFilterPI(e.target.value)}
                  />
                  <button
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1"
                    onClick={() => { setTableFilterSystem('all'); setTableFilterProject('all'); setTableFilterPI(''); }}
                  >
                    Clear
                  </button>
                  <button
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1"
                    onClick={exportTableCSV}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left table-fixed border border-gray-800">
                  <thead className="bg-black/70">
                    <tr className="text-gray-300">
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">#</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Platform</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Profile</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Latitude</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Longitude</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Positioning</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Project</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">PI</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">JULD</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">JULD Loc</th>
                      <th className="px-3 py-2 border border-gray-800 sticky top-0 bg-black/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((f, i) => (
                      <tr key={`${f.PLATFORM_NUMBER}-${f.profile_index}`} className="text-gray-200">
                        <td className="px-3 py-2 border border-gray-800">{i + 1}</td>
                        <td className="px-3 py-2 border border-gray-800 font-mono">{f.PLATFORM_NUMBER}</td>
                        <td className="px-3 py-2 border border-gray-800">{f.profile_index}</td>
                        <td className="px-3 py-2 border border-gray-800">{Number(f.LATITUDE).toFixed(4)}</td>
                        <td className="px-3 py-2 border border-gray-800">{Number(f.LONGITUDE).toFixed(4)}</td>
                        <td className="px-3 py-2 border border-gray-800">
                          <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-300">
                            {f.POSITIONING_SYSTEM}
                          </span>
                        </td>
                        <td className="px-3 py-2 border border-gray-800 whitespace-nowrap max-w-[16rem] truncate">{f.PROJECT_NAME}</td>
                        <td className="px-3 py-2 border border-gray-800 whitespace-nowrap max-w-[16rem] truncate">{f.PI_NAME}</td>
                        <td className="px-3 py-2 border border-gray-800 whitespace-nowrap">{formatDate(f.JULD)}</td>
                        <td className="px-3 py-2 border border-gray-800 whitespace-nowrap">{formatDate(f.JULD_LOCATION)}</td>
                        <td className="px-3 py-2 border border-gray-800">
                          <button
                            className="px-2 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300"
                            onClick={() => setSelectedFloat(f)}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="p-2 bg-black border-t border-gray-800 text-center text-xs text-gray-400">
        Argo Floats Visualization System | {floatsData.length} floats loaded
      </footer>
    </div>
  );
};

export default GlobeView;
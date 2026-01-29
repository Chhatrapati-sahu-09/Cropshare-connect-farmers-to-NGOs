import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const diseaseReports = [
    {
        district: "Nagpur",
        crop: "Cotton",
        disease: "Boll Rot",
        severity: "high",
        lat: 21.1458,
        lng: 79.0882,
        affectedArea: 1240,
    },
    {
        district: "Wardha",
        crop: "Soybean",
        disease: "Yellow Mosaic Virus",
        severity: "medium",
        lat: 20.7453,
        lng: 78.6022,
        affectedArea: 685,
    },
    {
        district: "Amravati",
        crop: "Wheat",
        disease: "Leaf Rust",
        severity: "low",
        lat: 20.9374,
        lng: 77.7796,
        affectedArea: 320,
    },
    {
        district: "Aurangabad",
        crop: "Maize",
        disease: "Common Rust",
        severity: "high",
        lat: 19.8762,
        lng: 75.3433,
        affectedArea: 1560,
    },
    {
        district: "Nashik",
        crop: "Cotton",
        disease: "Pink Bollworm",
        severity: "medium",
        lat: 19.9975,
        lng: 73.7898,
        affectedArea: 945,
    },
    {
        district: "Pune",
        crop: "Sugarcane",
        disease: "Red Rot",
        severity: "high",
        lat: 18.5204,
        lng: 73.8567,
        affectedArea: 2130,
    },
    {
        district: "Solapur",
        crop: "Jowar",
        disease: "Anthracnose",
        severity: "low",
        lat: 17.6711,
        lng: 75.9239,
        affectedArea: 410,
    },
    {
        district: "Sangli",
        crop: "Rice",
        disease: "Blast",
        severity: "medium",
        lat: 16.8635,
        lng: 75.6173,
        affectedArea: 1120,
    },
    {
        district: "Kolhapur",
        crop: "Cotton",
        disease: "Leaf Curl Virus",
        severity: "medium",
        lat: 16.705,
        lng: 73.7331,
        affectedArea: 785,
    },
    {
        district: "Ratnagiri",
        crop: "Rice",
        disease: "Sheath Blight",
        severity: "low",
        lat: 16.9891,
        lng: 73.3168,
        affectedArea: 230,
    },
    {
        district: "Belgaum",
        crop: "Maize",
        disease: "Turcicum Leaf Blight",
        severity: "high",
        lat: 15.8596,
        lng: 74.5045,
        affectedArea: 1890,
    },
    {
        district: "Bijapur",
        crop: "Wheat",
        disease: "Powdery Mildew",
        severity: "medium",
        lat: 16.8301,
        lng: 75.6701,
        affectedArea: 650,
    },
    {
        district: "Indore",
        crop: "Soybean",
        disease: "Stem Fly",
        severity: "low",
        lat: 22.7196,
        lng: 75.8577,
        affectedArea: 380,
    },
    {
        district: "Ujjain",
        crop: "Cotton",
        disease: "Boll Rot",
        severity: "high",
        lat: 23.1815,
        lng: 75.7733,
        affectedArea: 1450,
    },
    {
        district: "Gwalior",
        crop: "Wheat",
        disease: "Karnal Bunt",
        severity: "low",
        lat: 26.2183,
        lng: 78.1627,
        affectedArea: 290,
    },
    // NORTH INDIA
    {
        district: "Hisar",
        crop: "Wheat",
        disease: "Stripe Rust",
        severity: "high",
        lat: 29.1966,
        lng: 75.7345,
        affectedArea: 1680,
    },
    {
        district: "Ludhiana",
        crop: "Wheat",
        disease: "Flag Smut",
        severity: "medium",
        lat: 30.901,
        lng: 75.8573,
        affectedArea: 920,
    },
    {
        district: "Jalandhar",
        crop: "Rice",
        disease: "Brown Spot",
        severity: "high",
        lat: 31.326,
        lng: 75.5762,
        affectedArea: 1450,
    },
    {
        district: "Sangrur",
        crop: "Maize",
        disease: "Downy Mildew",
        severity: "medium",
        lat: 30.2497,
        lng: 75.6301,
        affectedArea: 1120,
    },
    {
        district: "Meerut",
        crop: "Wheat",
        disease: "Loose Smut",
        severity: "low",
        lat: 28.9845,
        lng: 77.7064,
        affectedArea: 450,
    },
    {
        district: "Varanasi",
        crop: "Rice",
        disease: "Sheath Rot",
        severity: "high",
        lat: 25.32,
        lng: 82.9789,
        affectedArea: 2340,
    },
    {
        district: "Lucknow",
        crop: "Wheat",
        disease: "Septoria Leaf Blotch",
        severity: "medium",
        lat: 26.8467,
        lng: 80.9462,
        affectedArea: 890,
    },
    {
        district: "Agra",
        crop: "Sugarcane",
        disease: "Top Rot",
        severity: "medium",
        lat: 27.1767,
        lng: 78.0081,
        affectedArea: 1560,
    },
    // EAST INDIA
    {
        district: "Burdwan",
        crop: "Rice",
        disease: "Tungro Disease",
        severity: "high",
        lat: 23.2383,
        lng: 87.3089,
        affectedArea: 2890,
    },
    {
        district: "Birbhum",
        crop: "Rice",
        disease: "Leaf Scald",
        severity: "medium",
        lat: 23.9821,
        lng: 87.3134,
        affectedArea: 1230,
    },
    {
        district: "Dhanbad",
        crop: "Rice",
        disease: "Bacterial Leaf Blight",
        severity: "high",
        lat: 23.7957,
        lng: 86.4304,
        affectedArea: 1890,
    },
    {
        district: "Bankura",
        crop: "Maize",
        disease: "Leaf Spot",
        severity: "low",
        lat: 23.2416,
        lng: 87.0688,
        affectedArea: 560,
    },
    {
        district: "Nalanda",
        crop: "Wheat",
        disease: "Tan Spot",
        severity: "medium",
        lat: 25.5348,
        lng: 85.4944,
        affectedArea: 1045,
    },
    {
        district: "Muzaffarpur",
        crop: "Rice",
        disease: "Rice Hispa",
        severity: "high",
        lat: 26.1209,
        lng: 85.3843,
        affectedArea: 2120,
    },
    {
        district: "Darbhanga",
        crop: "Rice",
        disease: "Narrow Brown Leaf Spot",
        severity: "medium",
        lat: 26.1539,
        lng: 85.8739,
        affectedArea: 1340,
    },
    // SOUTH INDIA
    {
        district: "Thanjavur",
        crop: "Rice",
        disease: "Gall Midge",
        severity: "high",
        lat: 10.787,
        lng: 79.1378,
        affectedArea: 2680,
    },
    {
        district: "Madurai",
        crop: "Cotton",
        disease: "Alternaria Leaf Spot",
        severity: "medium",
        lat: 9.9252,
        lng: 78.1198,
        affectedArea: 1125,
    },
    {
        district: "Coimbatore",
        crop: "Sugarcane",
        disease: "Ratoon Stunting Disease",
        severity: "high",
        lat: 11.0066,
        lng: 76.9271,
        affectedArea: 2450,
    },
    {
        district: "Tiruppur",
        crop: "Cotton",
        disease: "Spider Mite",
        severity: "medium",
        lat: 11.1085,
        lng: 77.3411,
        affectedArea: 980,
    },
    {
        district: "Chikmagalur",
        crop: "Coffee",
        disease: "Leaf Rust",
        severity: "high",
        lat: 13.3173,
        lng: 75.7597,
        affectedArea: 1560,
    },
    {
        district: "Mysore",
        crop: "Sugarcane",
        disease: "Smut Disease",
        severity: "medium",
        lat: 12.2958,
        lng: 76.6394,
        affectedArea: 1340,
    },
    {
        district: "Kolar",
        crop: "Groundnut",
        disease: "Leaf Spot",
        severity: "low",
        lat: 13.1339,
        lng: 78.1293,
        affectedArea: 680,
    },
    {
        district: "Nalgonda",
        crop: "Rice",
        disease: "Blast",
        severity: "high",
        lat: 17.3569,
        lng: 79.1306,
        affectedArea: 2240,
    },
    {
        district: "Hyderabad",
        crop: "Pulse",
        disease: "Fusarium Wilt",
        severity: "medium",
        lat: 17.385,
        lng: 78.4867,
        affectedArea: 1020,
    },
    // WEST INDIA
    {
        district: "Ahmedabad",
        crop: "Cotton",
        disease: "Leaf Curl",
        severity: "high",
        lat: 23.0225,
        lng: 72.5714,
        affectedArea: 2130,
    },
    {
        district: "Vadodara",
        crop: "Groundnut",
        disease: "Stem Rot",
        severity: "medium",
        lat: 22.3072,
        lng: 73.1812,
        affectedArea: 890,
    },
    {
        district: "Surat",
        crop: "Cotton",
        disease: "American Bollworm",
        severity: "high",
        lat: 21.1702,
        lng: 72.8311,
        affectedArea: 2560,
    },
    {
        district: "Rajkot",
        crop: "Groundnut",
        disease: "Rosette Virus",
        severity: "medium",
        lat: 21.6345,
        lng: 70.7964,
        affectedArea: 1240,
    },
    {
        district: "Junagadh",
        crop: "Pulse",
        disease: "Anthracnose",
        severity: "low",
        lat: 21.5222,
        lng: 70.4579,
        affectedArea: 560,
    },
    {
        district: "Jamnagar",
        crop: "Groundnut",
        disease: "Early Leaf Spot",
        severity: "high",
        lat: 22.4707,
        lng: 70.0883,
        affectedArea: 1780,
    },
    {
        district: "Bhavnagar",
        crop: "Sugarcane",
        disease: "Wilt",
        severity: "medium",
        lat: 21.7645,
        lng: 71.952,
        affectedArea: 1120,
    },
    // CENTRAL INDIA
    {
        district: "Bhopal",
        crop: "Soybean",
        disease: "Defoliating Blight",
        severity: "high",
        lat: 23.1815,
        lng: 77.4063,
        affectedArea: 1890,
    },
    {
        district: "Jabbulpur",
        crop: "Cotton",
        disease: "Gray Mildew",
        severity: "medium",
        lat: 23.1815,
        lng: 79.6064,
        affectedArea: 1020,
    },
    {
        district: "Chhindwara",
        crop: "Soybean",
        disease: "Rust",
        severity: "high",
        lat: 22.0595,
        lng: 78.9855,
        affectedArea: 2340,
    },
    {
        district: "Raipur",
        crop: "Rice",
        disease: "Stem Borer",
        severity: "high",
        lat: 21.2514,
        lng: 81.6296,
        affectedArea: 2670,
    },
    {
        district: "Durg",
        crop: "Rice",
        disease: "False Smut",
        severity: "medium",
        lat: 20.9517,
        lng: 80.8497,
        affectedArea: 1450,
    },
    {
        district: "Bilaspur",
        crop: "Maize",
        disease: "Kernel Rot",
        severity: "low",
        lat: 22.0896,
        lng: 82.1506,
        affectedArea: 620,
    },
    // NORTHEAST INDIA
    {
        district: "Assam (Kamrup)",
        crop: "Rice",
        disease: "Sheath Blight",
        severity: "high",
        lat: 26.1667,
        lng: 91.6,
        affectedArea: 3120,
    },
    {
        district: "Nagaland (Kohima)",
        crop: "Maize",
        disease: "Turcicum Leaf Blight",
        severity: "medium",
        lat: 25.6753,
        lng: 94.1087,
        affectedArea: 1340,
    },
    {
        district: "Meghalaya (East Khasi)",
        crop: "Pulse",
        disease: "Bacterial Wilt",
        severity: "high",
        lat: 25.467,
        lng: 91.856,
        affectedArea: 1680,
    },
    {
        district: "Manipur (Imphal)",
        crop: "Rice",
        disease: "Brown Spot",
        severity: "medium",
        lat: 24.817,
        lng: 94.9062,
        affectedArea: 1450,
    },
    {
        district: "Tripura (Agartala)",
        crop: "Rice",
        disease: "Blast",
        severity: "high",
        lat: 23.8103,
        lng: 91.2868,
        affectedArea: 2340,
    },
    {
        district: "Mizoram (Lunglei)",
        crop: "Maize",
        disease: "Leaf Spot",
        severity: "low",
        lat: 22.8844,
        lng: 93.0047,
        affectedArea: 780,
    },
    // HIMALAYAN REGION
    {
        district: "Himachal (Solan)",
        crop: "Wheat",
        disease: "Flag Smut",
        severity: "medium",
        lat: 30.8146,
        lng: 76.7803,
        affectedArea: 890,
    },
    {
        district: "Uttarakhand (Udham Singh Nagar)",
        crop: "Rice",
        disease: "Bacterial Leaf Streak",
        severity: "high",
        lat: 29.0588,
        lng: 79.4882,
        affectedArea: 1560,
    },
    {
        district: "Jammu & Kashmir (Srinagar)",
        crop: "Rice",
        disease: "Sodicity Damage",
        severity: "medium",
        lat: 34.0837,
        lng: 74.7973,
        affectedArea: 1120,
    },
    // EASTERN COASTAL REGIONS
    {
        district: "Odisha (Cuttack)",
        crop: "Rice",
        disease: "Bacterial Leaf Blight",
        severity: "high",
        lat: 20.4625,
        lng: 85.983,
        affectedArea: 2780,
    },
    {
        district: "Odisha (Balangir)",
        crop: "Pulse",
        disease: "Fusarium Wilt",
        severity: "medium",
        lat: 20.7595,
        lng: 83.4689,
        affectedArea: 1340,
    },
    {
        district: "West Bengal (Medinipur)",
        crop: "Rice",
        disease: "Gall Midge",
        severity: "high",
        lat: 22.3172,
        lng: 87.7297,
        affectedArea: 2450,
    },
    {
        district: "West Bengal (Nadia)",
        crop: "Wheat",
        disease: "Karnal Bunt",
        severity: "low",
        lat: 23.5436,
        lng: 88.4383,
        affectedArea: 620,
    },
    // KERALA & COASTAL SOUTH
    {
        district: "Kerala (Ernakulam)",
        crop: "Coconut",
        disease: "Leaf Rot",
        severity: "high",
        lat: 9.9312,
        lng: 76.2673,
        affectedArea: 1890,
    },
    {
        district: "Kerala (Thrissur)",
        crop: "Rice",
        disease: "Blast",
        severity: "medium",
        lat: 10.5276,
        lng: 76.2144,
        affectedArea: 1230,
    },
    {
        district: "Karnataka (Dakshina Kannada)",
        crop: "Coconut",
        disease: "Bud Rot",
        severity: "high",
        lat: 13.3333,
        lng: 74.9,
        affectedArea: 2120,
    },
    {
        district: "Karnataka (Uttara Kannada)",
        crop: "Arecanut",
        disease: "Inflorescence Rot",
        severity: "medium",
        lat: 14.5994,
        lng: 74.8442,
        affectedArea: 1040,
    },
    // ADDITIONAL NORTHERN REGIONS
    {
        district: "Haryana (Kurukshetra)",
        crop: "Wheat",
        disease: "Yellow Rust",
        severity: "high",
        lat: 29.9519,
        lng: 76.8404,
        affectedArea: 1890,
    },
    {
        district: "Haryana (Sirsa)",
        crop: "Maize",
        disease: "Banded Leaf Spot",
        severity: "medium",
        lat: 29.5401,
        lng: 75.0303,
        affectedArea: 1120,
    },
    {
        district: "Punjab (Patiala)",
        crop: "Sugarcane",
        disease: "Smut",
        severity: "high",
        lat: 30.3398,
        lng: 76.3869,
        affectedArea: 2340,
    },
    // ADDITIONAL CENTRAL REGIONS
    {
        district: "Madhya Pradesh (Gwalior)",
        crop: "Soybean",
        disease: "Charcoal Rot",
        severity: "medium",
        lat: 26.2183,
        lng: 78.1627,
        affectedArea: 1240,
    },
    {
        district: "Madhya Pradesh (Shahdol)",
        crop: "Rice",
        disease: "Leaf Folder",
        severity: "low",
        lat: 23.3732,
        lng: 81.2744,
        affectedArea: 780,
    },
    {
        district: "Madhya Pradesh (Khargone)",
        crop: "Cotton",
        disease: "Whitefly",
        severity: "high",
        lat: 21.8069,
        lng: 75.6047,
        affectedArea: 2130,
    },
    // ADDITIONAL SOUTHERN REGIONS
    {
        district: "Andhra Pradesh (Prakasam)",
        crop: "Groundnut",
        disease: "Leaf Spot",
        severity: "high",
        lat: 14.5123,
        lng: 79.7168,
        affectedArea: 1890,
    },
    {
        district: "Andhra Pradesh (Chittoor)",
        crop: "Rice",
        disease: "Brown Spot",
        severity: "medium",
        lat: 13.1939,
        lng: 79.1065,
        affectedArea: 1340,
    },
    {
        district: "Tamil Nadu (Cuddalore)",
        crop: "Rice",
        disease: "Leaf Scald",
        severity: "high",
        lat: 11.7458,
        lng: 79.7689,
        affectedArea: 2230,
    },
    {
        district: "Tamil Nadu (Dindigul)",
        crop: "Sugarcane",
        disease: "Ratoon Stunting Disease",
        severity: "medium",
        lat: 10.3673,
        lng: 77.9804,
        affectedArea: 1120,
    },
    // ADDITIONAL WESTERN REGIONS
    {
        district: "Maharashtra (Kolhapur)",
        crop: "Sugarcane",
        disease: "Top Rot",
        severity: "high",
        lat: 16.705,
        lng: 73.7331,
        affectedArea: 1680,
    },
    {
        district: "Maharashtra (Akola)",
        crop: "Cotton",
        disease: "Boll Rot",
        severity: "medium",
        lat: 20.7136,
        lng: 77.0197,
        affectedArea: 1240,
    },
    {
        district: "Gujarat (Banaskantha)",
        crop: "Wheat",
        disease: "Powdery Mildew",
        severity: "low",
        lat: 24.1821,
        lng: 72.1289,
        affectedArea: 890,
    },
    {
        district: "Gujarat (Kheda)",
        crop: "Groundnut",
        disease: "Stem Rot",
        severity: "high",
        lat: 22.7639,
        lng: 72.6821,
        affectedArea: 1560,
    },
    {
        district: "Rajasthan (Jaipur)",
        crop: "Wheat",
        disease: "Tan Spot",
        severity: "medium",
        lat: 26.9124,
        lng: 75.7873,
        affectedArea: 1340,
    },
    {
        district: "Rajasthan (Pali)",
        crop: "Pulse",
        disease: "Fusarium Wilt",
        severity: "high",
        lat: 25.7764,
        lng: 73.3304,
        affectedArea: 1890,
    },
    {
        district: "Rajasthan (Hanumangarh)",
        crop: "Cotton",
        disease: "Leaf Curl",
        severity: "medium",
        lat: 29.5466,
        lng: 74.3128,
        affectedArea: 1120,
    },
    // EXPANDED MAHARASHTRA DISTRICTS
    {
        district: "Maharashtra (Vidarba - Yavatmal)",
        crop: "Cotton",
        disease: "Boll Rot",
        severity: "high",
        lat: 20.3867,
        lng: 78.1263,
        affectedArea: 1890,
    },
    {
        district: "Maharashtra (Vidarbha - Washim)",
        crop: "Soybean",
        disease: "Yellow Mosaic Virus",
        severity: "medium",
        lat: 20.9947,
        lng: 76.553,
        affectedArea: 1240,
    },
    {
        district: "Maharashtra (Marathwada - Latur)",
        crop: "Jowar",
        disease: "Anthracnose",
        severity: "medium",
        lat: 18.4088,
        lng: 76.2297,
        affectedArea: 980,
    },
    {
        district: "Maharashtra (Marathwada - Nanded)",
        crop: "Sugarcane",
        disease: "Root Rot",
        severity: "low",
        lat: 19.1618,
        lng: 77.3289,
        affectedArea: 740,
    },
    {
        district: "Maharashtra (Konkan - Ratnagiri)",
        crop: "Coconut",
        disease: "Leaf Spot",
        severity: "medium",
        lat: 16.9891,
        lng: 73.3168,
        affectedArea: 1120,
    },
    // EXPANDED PUNJAB DISTRICTS
    {
        district: "Punjab (Ferozpur)",
        crop: "Wheat",
        disease: "Septoria Leaf Blotch",
        severity: "medium",
        lat: 30.9289,
        lng: 74.5803,
        affectedArea: 1340,
    },
    {
        district: "Punjab (Amritsar)",
        crop: "Rice",
        disease: "Panicle Blight",
        severity: "high",
        lat: 31.634,
        lng: 74.8723,
        affectedArea: 1680,
    },
    {
        district: "Punjab (Gurdaspur)",
        crop: "Maize",
        disease: "Banded Leaf Spot",
        severity: "low",
        lat: 32.179,
        lng: 75.4932,
        affectedArea: 890,
    },
    // EXPANDED KARNATAKA DISTRICTS
    {
        district: "Karnataka (Raichur)",
        crop: "Cotton",
        disease: "Leaf Curl",
        severity: "high",
        lat: 15.4167,
        lng: 76.5667,
        affectedArea: 2120,
    },
    {
        district: "Karnataka (Kolar)",
        crop: "Sugarcane",
        disease: "Smut",
        severity: "medium",
        lat: 13.1339,
        lng: 78.1293,
        affectedArea: 1340,
    },
    {
        district: "Karnataka (Shimoga)",
        crop: "Rice",
        disease: "Blast",
        severity: "high",
        lat: 13.9299,
        lng: 75.5681,
        affectedArea: 1890,
    },
    {
        district: "Karnataka (Haveri)",
        crop: "Jowar",
        disease: "Charcoal Rot",
        severity: "medium",
        lat: 14.7989,
        lng: 75.4044,
        affectedArea: 1120,
    },
    // EXPANDED TAMIL NADU DISTRICTS
    {
        district: "Tamil Nadu (Tiruchirappalli)",
        crop: "Rice",
        disease: "Leaf Scald",
        severity: "high",
        lat: 10.7905,
        lng: 78.7047,
        affectedArea: 2340,
    },
    {
        district: "Tamil Nadu (Salem)",
        crop: "Sugarcane",
        disease: "Red Rot",
        severity: "medium",
        lat: 11.6643,
        lng: 78.146,
        affectedArea: 1240,
    },
    {
        district: "Tamil Nadu (Erode)",
        crop: "Cotton",
        disease: "Whitefly",
        severity: "high",
        lat: 11.341,
        lng: 77.7172,
        affectedArea: 1780,
    },
    {
        district: "Tamil Nadu (Virudhunagar)",
        crop: "Groundnut",
        disease: "Leaf Spot",
        severity: "medium",
        lat: 9.5941,
        lng: 77.9567,
        affectedArea: 1120,
    },
    // EXPANDED TELANGANA DISTRICTS
    {
        district: "Telangana (Karimnagar)",
        crop: "Rice",
        disease: "Sheath Blight",
        severity: "high",
        lat: 18.4386,
        lng: 78.8394,
        affectedArea: 2120,
    },
    {
        district: "Telangana (Warangal)",
        crop: "Cotton",
        disease: "Leaf Curl Virus",
        severity: "medium",
        lat: 17.9689,
        lng: 79.5941,
        affectedArea: 1340,
    },
    {
        district: "Telangana (Nizamabad)",
        crop: "Pulse",
        disease: "Fusarium Wilt",
        severity: "high",
        lat: 18.6723,
        lng: 78.1093,
        affectedArea: 1890,
    },
    // EXPANDED ANDHRA PRADESH DISTRICTS
    {
        district: "Andhra Pradesh (Visakhapatnam)",
        crop: "Rice",
        disease: "Brown Spot",
        severity: "medium",
        lat: 17.6869,
        lng: 83.2185,
        affectedArea: 1450,
    },
    {
        district: "Andhra Pradesh (East Godavari)",
        crop: "Rice",
        disease: "Leaf Blast",
        severity: "high",
        lat: 17.5595,
        lng: 81.7746,
        affectedArea: 2560,
    },
    {
        district: "Andhra Pradesh (West Godavari)",
        crop: "Sugarcane",
        disease: "Red Rot",
        severity: "medium",
        lat: 16.6056,
        lng: 81.4277,
        affectedArea: 1340,
    },
    {
        district: "Andhra Pradesh (Nellore)",
        crop: "Groundnut",
        disease: "Rosette Virus",
        severity: "high",
        lat: 14.4426,
        lng: 79.9864,
        affectedArea: 1680,
    },
    // EXPANDED UTTAR PRADESH DISTRICTS
    {
        district: "Uttar Pradesh (Kanpur)",
        crop: "Wheat",
        disease: "Rust",
        severity: "high",
        lat: 26.4499,
        lng: 80.3319,
        affectedArea: 1890,
    },
    {
        district: "Uttar Pradesh (Moradabad)",
        crop: "Sugarcane",
        disease: "Smut",
        severity: "medium",
        lat: 28.8385,
        lng: 77.7597,
        affectedArea: 1240,
    },
    {
        district: "Uttar Pradesh (Bijnor)",
        crop: "Wheat",
        disease: "Karnal Bunt",
        severity: "low",
        lat: 29.387,
        lng: 78.1313,
        affectedArea: 890,
    },
    {
        district: "Uttar Pradesh (Allahabad)",
        crop: "Pulse",
        disease: "Anthracnose",
        severity: "medium",
        lat: 25.4358,
        lng: 81.8463,
        affectedArea: 1120,
    },
    // EXPANDED BIHAR DISTRICTS
    {
        district: "Bihar (Patna)",
        crop: "Rice",
        disease: "Sheath Blight",
        severity: "high",
        lat: 25.5941,
        lng: 85.1376,
        affectedArea: 2340,
    },
    {
        district: "Bihar (Begusarai)",
        crop: "Rice",
        disease: "Leaf Roller",
        severity: "medium",
        lat: 25.6509,
        lng: 86.1208,
        affectedArea: 1340,
    },
    {
        district: "Bihar (Saharsa)",
        crop: "Wheat",
        disease: "Flag Smut",
        severity: "low",
        lat: 25.9847,
        lng: 86.5953,
        affectedArea: 780,
    },
    // EXPANDED JHARKHAND DISTRICTS
    {
        district: "Jharkhand (Ranchi)",
        crop: "Rice",
        disease: "Brown Spot",
        severity: "high",
        lat: 23.3441,
        lng: 85.3096,
        affectedArea: 1680,
    },
    {
        district: "Jharkhand (Dumka)",
        crop: "Maize",
        disease: "Turcicum Leaf Blight",
        severity: "medium",
        lat: 24.2742,
        lng: 87.2588,
        affectedArea: 1120,
    },
    {
        district: "Jharkhand (Deoghar)",
        crop: "Pulse",
        disease: "Bacterial Wilt",
        severity: "medium",
        lat: 24.5028,
        lng: 86.6774,
        affectedArea: 1040,
    },
    // EXPANDED ODISHA DISTRICTS
    {
        district: "Odisha (Angul)",
        crop: "Rice",
        disease: "Gall Midge",
        severity: "high",
        lat: 20.8346,
        lng: 85.0033,
        affectedArea: 1890,
    },
    {
        district: "Odisha (Dhenkanal)",
        crop: "Pulse",
        disease: "Anthracnose",
        severity: "medium",
        lat: 20.6944,
        lng: 85.605,
        affectedArea: 1240,
    },
    {
        district: "Odisha (Bargarh)",
        crop: "Jowar",
        disease: "Stem Fly",
        severity: "low",
        lat: 21.8156,
        lng: 84.1516,
        affectedArea: 890,
    },
    // EXPANDED GUJARATI DISTRICTS
    {
        district: "Gujarat (Surendranagar)",
        crop: "Groundnut",
        disease: "Early Leaf Spot",
        severity: "high",
        lat: 22.7167,
        lng: 71.9167,
        affectedArea: 1680,
    },
    {
        district: "Gujarat (Sabarkantha)",
        crop: "Wheat",
        disease: "Powdery Mildew",
        severity: "medium",
        lat: 23.8211,
        lng: 72.5339,
        affectedArea: 1120,
    },
    {
        district: "Gujarat (Valsad)",
        crop: "Cotton",
        disease: "Leaf Curl",
        severity: "medium",
        lat: 20.6117,
        lng: 72.935,
        affectedArea: 1040,
    },
    {
        district: "Gujarat (The Dangs)",
        crop: "Rice",
        disease: "Blast",
        severity: "low",
        lat: 20.7595,
        lng: 73.8042,
        affectedArea: 780,
    },
    // EXPANDED WEST BENGAL DISTRICTS
    {
        district: "West Bengal (Kolkata)",
        crop: "Rice",
        disease: "Leaf Scald",
        severity: "medium",
        lat: 22.5726,
        lng: 88.3639,
        affectedArea: 1240,
    },
    {
        district: "West Bengal (24 Parganas)",
        crop: "Rice",
        disease: "Sheath Blight",
        severity: "high",
        lat: 21.8854,
        lng: 88.1193,
        affectedArea: 2120,
    },
    {
        district: "West Bengal (Hooghly)",
        crop: "Wheat",
        disease: "Septoria Leaf Blotch",
        severity: "low",
        lat: 23.0382,
        lng: 88.3944,
        affectedArea: 1020,
    },
    // EXPANDED ASSAM DISTRICTS
    {
        district: "Assam (Nagaon)",
        crop: "Rice",
        disease: "Leaf Folder",
        severity: "high",
        lat: 26.1686,
        lng: 92.0347,
        affectedArea: 2340,
    },
    {
        district: "Assam (Sonitpur)",
        crop: "Rice",
        disease: "Brown Spot",
        severity: "medium",
        lat: 26.6333,
        lng: 92.8,
        affectedArea: 1340,
    },
    {
        district: "Assam (Cachar)",
        crop: "Maize",
        disease: "Leaf Spot",
        severity: "low",
        lat: 24.8723,
        lng: 91.2703,
        affectedArea: 890,
    },
    // EXPANDED KERALA DISTRICTS
    {
        district: "Kerala (Kottayam)",
        crop: "Rice",
        disease: "Blast",
        severity: "medium",
        lat: 9.6271,
        lng: 76.5268,
        affectedArea: 1240,
    },
    {
        district: "Kerala (Alappuzha)",
        crop: "Coconut",
        disease: "Leaf Rot",
        severity: "high",
        lat: 9.4867,
        lng: 76.3419,
        affectedArea: 1680,
    },
    {
        district: "Kerala (Malappuram)",
        crop: "Rice",
        disease: "Panicle Blight",
        severity: "medium",
        lat: 10.7089,
        lng: 76.0625,
        affectedArea: 1120,
    },
    // EXPANDED HIMACHAL PRADESH DISTRICTS
    {
        district: "Himachal Pradesh (Kangra)",
        crop: "Wheat",
        disease: "Flag Smut",
        severity: "low",
        lat: 32.2206,
        lng: 76.2569,
        affectedArea: 980,
    },
    {
        district: "Himachal Pradesh (Una)",
        crop: "Maize",
        disease: "Turcicum Leaf Blight",
        severity: "medium",
        lat: 31.4724,
        lng: 76.2705,
        affectedArea: 1120,
    },
    // EXPANDED RAJASTHAN DISTRICTS
    {
        district: "Rajasthan (Udaipur)",
        crop: "Maize",
        disease: "Leaf Spot",
        severity: "medium",
        lat: 24.5854,
        lng: 73.7125,
        affectedArea: 1240,
    },
    {
        district: "Rajasthan (Barmer)",
        crop: "Pulse",
        disease: "Root Rot",
        severity: "low",
        lat: 25.8103,
        lng: 71.3932,
        affectedArea: 890,
    },
    {
        district: "Rajasthan (Kota)",
        crop: "Groundnut",
        disease: "Leaf Spot",
        severity: "high",
        lat: 25.2138,
        lng: 75.8648,
        affectedArea: 1560,
    },
    {
        district: "Rajasthan (Nagaur)",
        crop: "Cotton",
        disease: "Whitefly",
        severity: "medium",
        lat: 27.2127,
        lng: 74.7195,
        affectedArea: 1340,
    },
    // EXPANDED MADHYA PRADESH DISTRICTS
    {
        district: "Madhya Pradesh (Indore)",
        crop: "Soybean",
        disease: "Defoliating Blight",
        severity: "high",
        lat: 22.7196,
        lng: 75.8577,
        affectedArea: 1890,
    },
    {
        district: "Madhya Pradesh (Mandsaur)",
        crop: "Wheat",
        disease: "Rust",
        severity: "medium",
        lat: 24.0634,
        lng: 75.073,
        affectedArea: 1340,
    },
    {
        district: "Madhya Pradesh (Sehore)",
        crop: "Pulse",
        disease: "Anthracnose",
        severity: "low",
        lat: 23.392,
        lng: 77.8853,
        affectedArea: 1020,
    },
    {
        district: "Madhya Pradesh (Seoni)",
        crop: "Rice",
        disease: "Sheath Blight",
        severity: "high",
        lat: 22.2086,
        lng: 79.5467,
        affectedArea: 1680,
    },
    // EXPANDED HARYANA DISTRICTS
    {
        district: "Haryana (Hisar)",
        crop: "Wheat",
        disease: "Karnal Bunt",
        severity: "low",
        lat: 29.1966,
        lng: 75.7345,
        affectedArea: 1120,
    },
    {
        district: "Haryana (Rohtak)",
        crop: "Sugarcane",
        disease: "Top Rot",
        severity: "medium",
        lat: 28.899,
        lng: 76.5634,
        affectedArea: 1240,
    },
    {
        district: "Haryana (Jind)",
        crop: "Rice",
        disease: "Panicle Blight",
        severity: "medium",
        lat: 29.3057,
        lng: 75.9292,
        affectedArea: 1120,
    },
];

const cropOptions = [
    "Cotton",
    "Soybean",
    "Wheat",
    "Rice",
    "Maize",
    "Sugarcane",
    "Jowar",
    "Pulse",
    "Tobacco",
];

const getColor = (severity) => {
    if (severity === "high") return "#e53935";
    if (severity === "medium") return "#fb8c00";
    return "#43a047";
};

export default function App() {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerLayerRef = useRef(null);
    const legendRef = useRef(null);

    const [cropFilter, setCropFilter] = useState("all");
    const [severityFilter, setSeverityFilter] = useState("all");

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, { attributionControl: false }).setView(
            [20.5937, 78.9629],
            5
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "",
        }).addTo(map);

        markerLayerRef.current = L.layerGroup().addTo(map);

        const legend = L.control({ position: "bottomright" });
        legend.onAdd = function () {
            const div = L.DomUtil.create("div", "legend");
            div.innerHTML = "<div class=\"legend-title\">Disease Severity</div>";
            div.innerHTML +=
                '<div class="legend-item"><i class="legend-dot legend-dot-high"></i> <span>High</span></div>';
            div.innerHTML +=
                '<div class="legend-item"><i class="legend-dot legend-dot-medium"></i> <span>Medium</span></div>';
            div.innerHTML +=
                '<div class="legend-item"><i class="legend-dot legend-dot-low"></i> <span>Low</span></div>';
            return div;
        };
        legend.addTo(map);
        legendRef.current = legend;

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!markerLayerRef.current) return;
        markerLayerRef.current.clearLayers();

        diseaseReports.forEach((d) => {
            if ((cropFilter === "all" || d.crop === cropFilter) && (severityFilter === "all" || d.severity === severityFilter)) {
                const markerSize = d.severity === "high" ? 10 : d.severity === "medium" ? 8 : 6;

                L.circleMarker([d.lat, d.lng], {
                    radius: markerSize,
                    color: "#000",
                    weight: 1.5,
                    fillColor: getColor(d.severity),
                    fillOpacity: 0.8,
                })
                    .bindPopup(
                        `
              <div class="popup-content">
                <div class="popup-row"><b>District:</b> ${d.district}</div>
                <div class="popup-row"><b>Crop:</b> ${d.crop}</div>
                <div class="popup-row"><b>Disease:</b> ${d.disease}</div>
                <div class="popup-row"><b>Severity:</b> <span class="popup-severity" style="color: ${getColor(
                            d.severity
                        )}">${d.severity}</span></div>
                <div class="popup-row"><b>Affected Area:</b> ${d.affectedArea} hectares</div>
              </div>
            `
                    )
                    .addTo(markerLayerRef.current);
            }
        });
    }, [cropFilter, severityFilter]);

    return (
        <div className="page">
            <header className="header">
                <span aria-hidden="true">🌾</span>
                CropShare – Disease Intelligence Map
            </header>

            <div className="controls">
                <div className="control-group">
                    <label htmlFor="cropFilter">Crop:</label>
                    <select
                        id="cropFilter"
                        value={cropFilter}
                        onChange={(event) => setCropFilter(event.target.value)}
                    >
                        <option value="all">All Crops</option>
                        {cropOptions.map((crop) => (
                            <option key={crop} value={crop}>
                                {crop}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="severityFilter">Severity:</label>
                    <select
                        id="severityFilter"
                        value={severityFilter}
                        onChange={(event) => setSeverityFilter(event.target.value)}
                    >
                        <option value="all">All Levels</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            <div ref={mapContainerRef} className="map" />
        </div>
    );
}

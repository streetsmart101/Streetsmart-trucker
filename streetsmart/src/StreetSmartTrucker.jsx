import { useState, useRef, useEffect } from "react";

// ─── EMBEDDED ASSETS ─────────────────────────────────────────────────────────
const LOGO_IMAGE = "";   // splash/login screen
const BG_IMAGE = null;

const C = {
  bg:"#0D0F14", bg2:"#13161E", bg3:"#1A1E2A", bg4:"#1F2330",
  border:"#252A38", border2:"#2E3447",
  amber:"#F5A623", amberDim:"rgba(245,166,35,0.15)", amberGlow:"rgba(245,166,35,0.35)",
  blue:"#4FC3F7", blueDim:"rgba(79,195,247,0.15)",
  green:"#4CAF7D", greenDim:"rgba(76,175,125,0.15)",
  red:"#EF5350", redDim:"rgba(239,83,80,0.15)",
  purple:"#9C6FFF", purpleDim:"rgba(156,111,255,0.15)",
  white:"#FFFFFF", offWhite:"#E8EAF0",
  gray1:"#9AA3B8", gray2:"#555E78", gray3:"#2E3447",
};

const TRACKS = [
  { id:"beginner", icon:"🎓", label:"Beginner CDL", short:"Beginner", desc:"Just starting your CDL journey", color:C.amber, bg:"rgba(245,166,35,0.08)" },
  { id:"company",  icon:"🚛", label:"Company Driver", short:"Company",  desc:"Already driving, leveling up skills", color:C.blue,  bg:"rgba(79,195,247,0.08)" },
  { id:"owner",    icon:"💼", label:"Owner-Operator", short:"Owner-Op", desc:"Building your own trucking business", color:C.green, bg:"rgba(76,175,125,0.08)" },
];

// ─── LESSONS DATA ─────────────────────────────────────────────────────────────

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────────────────────
const LS_KEY = 'streetsmart_v3';
const lsLoad = () => { try { const d = localStorage.getItem(LS_KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; } };
const lsSave = (data) => { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch(e) {} };

const LESSONS = {
  beginner:[
    { id:"b1", title:"Pre-Trip Inspection", icon:"🔍", duration:"3 min read", xp:50, content:[
      { type:"intro", text:"A pre-trip inspection is required by FMCSA before every trip.." },
      { type:"steps", title:"7-Step Inspection Process", items:[
        "1. Approach and Overview - Walk around the truck noting obvious damage,.",  "2. Engine Compartment - Check oil, coolant, power steering fluid, belts, hoses.",
        "3. Cab Interior - Gauges, mirrors, seatbelt, horn, wipers, emergency equipment.",  "4. Lights and Reflectors - Test all headlights, brake lights, turn.",
        "5. Front Axle and Steering - Tires, lug nuts, steering linkage, brake components.",  "6. Fuel and Exhaust - No leaks, secure caps, exhaust routing intact, no smoke.",
        "7. Cargo and Coupling - Verify load secured, fifth wheel locked, glad.", ]},
      { type:"tip", text:"Do your inspection in the same order every single time. Muscle." },
      { type:"quiz", q:"How often is a pre-trip inspection legally required?", opts:["Once a week","Before every trip","Every 500 miles","Only for loads over 10,000 lbs"], ans:1, exp:"FMCSA 49 CFR Section 392.7 requires a vehicle inspection before every trip. There are no exceptions." },
    ]},
    { id:"b2", title:"Backing Maneuvers", icon:"🔄", duration:"3 min read", xp:75, content:[
      { type:"intro", text:"Backing causes more accidents than any other trucking maneuver.." },
      { type:"steps", title:"The Four Core Backing Types", items:[
        "Straight-line backing - Equal mirror use, small corrections early, never chase the trailer.",  "Offset backing - Set the trailer angle first, then align the tractor. Never rush the set.",
        "45-degree alley dock - Approach angle determines success. Perfect your setup, not your recovery.",  "Parallel parking - Requires 3 reference points. Know your truck dimensions cold.",
      ]},
      { type:"tip", text:"S.M.S.M. Small moves, small moves. One inch of wheel equals feet." },
      { type:"quiz", q:"What does G.O.A.L. stand for?", opts:["Get Out And Look","Go On A Lane","Guide Other Auto Lanes","Grip On A Load"], ans:0, exp:"G.O.A.L. means Get Out And Look. Always physically walk behind your truck and check clearances." },
    ]},
    { id:"b3", title:"Road Driving Fundamentals", icon:"🛣️", duration:"3 min read", xp:60, content:[
      { type:"intro", text:"A fully loaded semi truck at 80,000 lbs needs 4-6 times the." },
      { type:"steps", title:"Core Driving Principles", items:[
        "Following Distance - Minimum 7 seconds at highway speed. 14 seconds in rain or fog.",  "Downhill Grades - Select gear before descent. Engine brake first, service brakes second.",
        "Right Turns - Begin wide left, track rear wheels over the curb line, watch trailer swing.",  "Lane Changes - Signal 3-5 seconds early. Check mirrors three times before moving.",
        "Highway Entry - Match speed before merging. Never force traffic to adjust for you.",  "Railroad Crossings - Shift to neutral, never shift mid-crossing, check both directions.",
      ]},
      { type:"tip", text:"Look 15 seconds ahead on the highway. That is a quarter mile. If." },
      { type:"quiz", q:"What is the minimum following distance recommended at highway speed?", opts:["3 seconds","5 seconds","7 seconds","10 seconds"], ans:2, exp:"FMCSA recommends a minimum of 7 seconds following distance at highway speed for CMVs. This is." },
    ]},
    { id:"b4", title:"HOS and ELD Basics", icon:"⏱️", duration:"3 min read", xp:80, content:[
      { type:"intro", text:"Hours of Service violations are the number one DOT violation in." },
      { type:"steps", title:"The Core HOS Rules for Property Carriers", items:[
        "11-Hour Driving Limit - Maximum 11 hours driving after 10 consecutive hours off duty.",  "14-Hour On-Duty Limit - Cannot drive after 14 hours from when you went on duty.",
        "30-Minute Break - Required after 8 cumulative hours of driving. Off-duty or sleeper only.",  "60/70-Hour Rule - 60 hours in 7 days OR 70 hours in 8 days for most carriers.",
        "34-Hour Restart - Reset your 60/70-hour clock with 34 consecutive off-duty hours.",  "Sleeper Berth Split - 7/3 or 8/2 split allowed but requires careful ELD management.",
      ]},
      { type:"tip", text:"Your 14-hour clock starts the moment you go on duty, even for." },
      { type:"quiz", q:"What starts the 14-hour on-duty clock?", opts:["When you start driving","When you sign the BOL","The moment you go on duty","When the dispatcher calls"], ans:2, exp:"The 14-hour clock begins the moment you go on duty, regardless of activity. Loading, fueling,." },
    ]},
    { id:"b5", title:"CDL Test Preparation", icon:"📝", duration:"6 min read", xp:100, content:[
      { type:"intro", text:"The CDL written knowledge test covers general knowledge, air." },
      { type:"steps", title:"Test Day Strategy", items:[
        "General Knowledge - 50 questions, covers all basic CMV operation rules.",  "Air Brakes - Required if your vehicle has air brakes. 25 questions, must score 80%+.",
        "Combination Vehicles - Required for Class A. 20 questions on coupling, trailers, turning.",  "Study Method - Take practice tests until you consistently score 90%+ before the real test.",
        "Test Day - Read each question twice. Eliminate obvious wrong answers first.",  "Common Fails - Air brakes section trips up most beginners. Study it hardest.",
      ]},
      { type:"tip", text:"Take the practice test every single day for 2 weeks before your." },
      { type:"quiz", q:"What is the minimum passing score on most CDL knowledge tests?", opts:["70%","75%","80%","85%"], ans:2, exp:"Most states require a minimum score of 80% to pass CDL knowledge tests. Some states and." },
    ]},

    { id:"b6", title:"Air Brakes Deep Dive", icon:"🛑", duration:"5 min read", xp:90, content:[
      { type:"intro", text:"Air brakes are on virtually every commercial truck. Failing the." },
      { type:"steps", title:"How Air Brakes Work", items:[
        "1. Air Compressor - Pumps air into storage tanks. Must build from 50 to 90.",  "2. Governor - Controls compressor. Cuts in around 100 PSI, cuts out around.",
        "3. Air Tanks - Store compressed air. Drain daily to remove water and oil.",  "4. Brake Chambers - Air pressure pushes a rod that applies the brakes at.",
        "5. Slack Adjusters - Connect the push rod to the brake cam. Must not move.",  "6. Brake Drums and Shoes - The friction surfaces. Shoes must be at least.",
        "7. Spring Brakes - Emergency and parking brakes held ON by spring." ]},
      { type:"tip", title:"Big Earl Says", text:"Every driver I've seen get in trouble with air brakes ignored." },
      { type:"steps", title:"The 5 Air Brake Tests", items:[
        "Test 1 - Build-up: Start engine, should build from 50-90 PSI in under 3 minutes.",  "Test 2 - Governor check: At 120-125 PSI compressor should cut out.",
        "Test 3 - Warning signal: Turn off engine, pump brakes - warning light/buzzer at 60 PSI.",  "Test 4 - Spring brake test: Continue pumping - parking brakes should pop on at 20-45 PSI.",
        "Test 5 - Leakdown test: Engine off, release brakes, hold foot brake 1 minute - lose no more than 3 PSI."
      ]}, { type:"quiz", questions:[
        { q:"What PSI must air pressure build to from 50 PSI in under 3 minutes?", opts:["80 PSI","90 PSI","100 PSI","110 PSI"], ans:1, exp:"Air pressure must build from 50 to 90 PSI in under 3 minutes during the build-up test." },
        { q:"At what PSI should the low air pressure warning activate?", opts:["40 PSI","50 PSI","60 PSI","80 PSI"], ans:2, exp:"The low air pressure warning (buzzer/light) must activate before pressure drops below 60 PSI." },
        { q:"What is the maximum leakdown rate for a combination vehicle with brakes released?", opts:["2 PSI/min","3 PSI/min","4 PSI/min","5 PSI/min"], ans:1, exp:"Air loss must not exceed 3 PSI in one minute with the engine off and brakes released." },
        { q:"Spring brakes automatically activate when air pressure drops to what range?", opts:["60-80 PSI","40-60 PSI","20-45 PSI","10-20 PSI"], ans:2, exp:"Spring brakes activate at 20-45 PSI. At this point the parking/emergency brakes engage automatically." },
      ]}, ]},
    { id:"b7", title:"Coupling and Uncoupling", icon:"🔗", duration:"4 min read", xp:85, content:[
      { type:"intro", text:"Improper coupling is one of the most dangerous mistakes a CDL." },
      { type:"steps", title:"Coupling Procedure - 10 Steps", items:[
        "1. Inspect fifth wheel - check for damage, proper lubrication, locking jaws open.",  "2. Position tractor - back slowly, check mirrors, stop before contact.",
        "3. Check trailer height - trailer should be slightly lower than fifth wheel.",  "4. Connect air lines and electrical - emergency (red) first, then service (blue).",
        "5. Back under trailer - stop when fifth wheel contacts trailer apron.",  "6. Test the connection - tug forward against locked trailer brakes.",
        "7. Inspect the lock - visually confirm jaws are around the kingpin.",  "8. Raise landing gear - crank fully up, secure the crank.",
        "9. Disconnect trailer brake supply - release red valve.",  "10. Check clearance - ensure trailer clears rear of cab on turns."
      ]},
      { type:"tip", title:"Big Earl Says", text:"The visual check on the jaws is not optional. I have seen." },
      { type:"quiz", questions:[
        { q:"When coupling, what must you do AFTER backing under the trailer?", opts:["Raise landing gear","Pull forward to test coupling","Connect air lines","Check fifth wheel grease"], ans:1, exp:"Always perform the tug test by pulling forward against locked trailer brakes to verify the coupling." },
        { q:"The kingpin locking jaws must be visually confirmed to be:", opts:["Partially closed","Fully open","Fully closed around kingpin","Greased and open"], ans:2, exp:"Jaws must be fully closed around the kingpin. The visual check is mandatory - the tug test alone is." },
        { q:"What color is the emergency air line glad hand?", opts:["Blue","Yellow","Red","Green"], ans:2, exp:"Red is emergency, blue is service. Connect emergency (red) first, service (blue) second." },
        { q:"Landing gear must be in what position before driving?", opts:["Partially raised","Fully raised and crank secured","Lowered for stability","It does not matter"], ans:1, exp:"Landing gear must be fully raised and the crank handle secured before moving." },
      ]}, ]},
    { id:"b8", title:"Hazmat Awareness", icon:"☢️", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"Even if you never plan to haul hazmat, you need to recognize it,." },
      { type:"steps", title:"The 9 Hazmat Classes", items:[
        "Class 1 - Explosives (dynamite, fireworks, ammunition)",  "Class 2 - Gases (compressed, liquefied, or dissolved gas)",
        "Class 3 - Flammable Liquids (gasoline, fuel oil, paint)",  "Class 4 - Flammable Solids (matches, metal powders)",
        "Class 5 - Oxidizers and Organic Peroxides",  "Class 6 - Poisons and Infectious Substances",
        "Class 7 - Radioactive Materials",  "Class 8 - Corrosives (battery acid, bleach)",
        "Class 9 - Miscellaneous Hazardous Materials" ]}, { type:"steps", title:"Placarding Rules", items:[
        "1,001 lbs or more of most hazmat requires diamond-shaped placards on all 4 sides.",  "ANY amount of Class 1, 2.3, 4.3, 6.1 (Poison Inhalation Hazard), 7, or dangerous requires placards.",
        "Shipping papers must be within reach of driver at all times - left side door pocket.",  "Emergency response guidebook must be in the cab."
      ]},
      { type:"tip", title:"Big Earl Says", text:"If a shipper hands you a load and you see a placard on the." },
      { type:"quiz", questions:[ { q:"Which hazmat class covers flammable liquids like gasoline?", opts:["Class 1","Class 2","Class 3","Class 4"], ans:2, exp:"Class 3 covers flammable liquids including gasoline, fuel oil, and paint." },
        { q:"Shipping papers must be kept where while driving?", opts:["In the trailer","In the glove box","Within reach of driver - left door pocket","At the carrier office"], ans:2, exp:"Shipping papers must be within reach of the driver at all times, typically in the left door pocket." },
        { q:"How many pounds of most hazmat require placards on all 4 sides?", opts:["500 lbs","750 lbs","1,001 lbs","2,000 lbs"], ans:2, exp:"1,001 lbs or more of most hazardous materials requires diamond-shaped placards on all four sides of." },
        { q:"Which hazmat class requires placards regardless of quantity?", opts:["Class 3","Class 8","Class 6","Class 2.3 Poison Inhalation Hazard"], ans:3, exp:"Class 2.3 (Poison Inhalation Hazard) requires placards for ANY amount, no minimum weight threshold." },
      ]}, ]},
    { id:"b9", title:"Mountain and Grade Driving", icon:"⛰️", duration:"4 min read", xp:85, content:[
      { type:"intro", text:"More truckers die on mountain grades than almost any other." },
      { type:"steps", title:"Descending Grades Safely", items:[
        "1. Check your speed BEFORE the descent - posted speed for trucks is your.",  "2. Select the right gear BEFORE the descent - same gear you would use going up.",
        "3. Use the brake application method - apply firm pressure, slow to 5 mph.",  "4. Let brakes cool between applications - continuous braking causes brake fade.",
        "5. Never ride the brakes - friction heat boils brake fluid and glazes drums.",  "6. Watch for runaway truck ramps - they exist because people miscalculate..",
        "7. Engine brake (Jake brake) - use to slow without heat buildup. Check." ]},
      { type:"tip", title:"Big Earl Says", text:"The gear you go up in is the gear you go down in. I do not care." },
      { type:"quiz", questions:[
        { q:"What gear should you use going down a steep grade?", opts:["One gear higher than going up","Same gear as going up","Neutral to save fuel","Highest gear possible"], ans:1, exp:"Select the same gear going down as you would use going up. This prevents brake overheating." },
        { q:"What is brake fade caused by?", opts:["Too much air pressure","Continuous braking creating heat","Brakes that are too tight","Cold weather"], ans:1, exp:"Continuous braking generates friction heat that boils brake fluid and glazes drums, causing fade -." },
        { q:"The correct mountain braking method is:", opts:["Ride brakes continuously","Apply firm pressure, slow 5 mph below target, release, repeat","Use only engine brake","Stay in highest gear possible"], ans:1, exp:"Apply brakes firmly, slow to 5 mph below safe speed, release to let brakes cool, then repeat as needed." },
        { q:"A runaway truck ramp should be used when:", opts:["You are running late","You feel your brakes fading and cannot control speed","Traffic is too heavy","Your dispatcher says to"], ans:1, exp:"Use the ramp any time brakes are fading and you cannot control your speed. It is always the right." },
      ]}, ]},
    { id:"b10", title:"Night and Weather Driving", icon:"🌧️", duration:"4 min read", xp:75, content:[
      { type:"intro", text:"Driving conditions that would be manageable in a car become." },
      { type:"steps", title:"Night Driving Rules", items:[
        "1. Use high beams when no oncoming traffic - you need every foot of visibility.",  "2. Drive to your headlight range - if you can see 400 feet, your stopping.",
        "3. Clean all lights before dark - dirty marker lights are invisible to.",  "4. Watch for deer at dusk and dawn - most animal strikes happen in.",
        "5. Take rest breaks - fatigue hits hardest between midnight and 6 AM." ]}, { type:"steps", title:"Weather Driving Rules", items:[
        "Rain: Reduce speed 1/3. Increase following distance. Watch for hydroplaning at highway speeds.",  "Snow/Ice: Reduce speed by half minimum. Black ice is invisible - treat all dark pavement as ice.",
        "Wind: Loaded trailers act as sails. High profile loads need wind speed awareness.",  "Fog: Use low beams - high beams reflect back and blind you. If visibility under 100 feet, pull over."
      ]},
      { type:"tip", title:"Big Earl Says", text:"There is no load worth dying for. If the weather is bad enough." },
      { type:"quiz", questions:[ { q:"In rain, you should reduce speed by approximately:", opts:["10%","25%","One third","One half"], ans:2, exp:"In rain reduce speed by at least one third. A truck that stops in 300 feet dry may need 450+ feet." },
        { q:"In fog with visibility under 100 feet, you should:", opts:["Use high beams","Use low beams and slow down","Pull over and stop","Flash hazards and continue"], ans:2, exp:"Pull over when visibility drops below 100 feet. High beams reflect back in fog and reduce visibility further." },
        { q:"Which type of pavement is most dangerous and invisible to drivers?", opts:["Wet concrete","Gravel","Black ice","Packed snow"], ans:2, exp:"Black ice is a thin transparent layer of ice that looks like wet pavement. It is invisible and." },
        { q:"When driving at night, you should:", opts:["Drive faster to reduce exposure","Always use high beams","Drive within your headlight range","Ignore the speed limit"], ans:2, exp:"Drive to your headlight range - if you can see 400 feet ahead, your stopping distance must be under 400 feet." },
      ]}, ]},
    { id:"b11", title:"Hours of Service Deep Dive", icon:"⏰", duration:"5 min read", xp:90, content:[
      { type:"intro", text:"HOS violations are the number one way drivers lose their CDL and." },
      { type:"steps", title:"The 4 Key HOS Rules", items:[
        "11-Hour Rule - May drive maximum 11 hours after 10 consecutive hours off duty.",  "14-Hour Rule - May not drive beyond the 14th hour after coming on duty. Cannot extend with breaks.",
        "30-Minute Break - Must take 30-minute break after 8 hours of driving time.",  "60/70-Hour Rule - Cannot drive after 60 hours on duty in 7 days OR 70 hours in 8 days."
      ]}, { type:"steps", title:"Resets and Exceptions", items:[
        "34-Hour Restart - Reset 60/70 hour clock with 34 consecutive hours off duty.",  "Sleeper Berth Split - Can split required 10 hours rest into two periods (8+2 or 7+3).",
        "Short-Haul Exception - Drivers within 150 air miles of home terminal may skip ELD in some cases.",  "Adverse Conditions - May extend 11-hour limit by 2 hours if conditions develop unexpectedly."
      ]},
      { type:"tip", title:"Big Earl Says", text:"The 14-hour clock is the one that gets people. It does not stop." },
      { type:"quiz", questions:[ { q:"The maximum driving time allowed per shift is:", opts:["10 hours","11 hours","12 hours","14 hours"], ans:1, exp:"You may drive a maximum of 11 hours after 10 consecutive hours off duty." },
        { q:"The 14-hour window starts when:", opts:["You start driving","You leave the terminal","You come on duty","You take your first break"], ans:2, exp:"The 14-hour clock starts when you first come on duty - not when you start driving. Breaks do not pause it." },
        { q:"What is required after 8 hours of driving?", opts:["A 30-minute break","A 1-hour break","10 hours off duty","Nothing is required"], ans:0, exp:"A 30-minute break is required after 8 cumulative hours of driving time." },
        { q:"A 34-hour restart resets which clock?", opts:["The 11-hour driving limit","The 14-hour window","The 60/70-hour on-duty limit","The sleeper berth split"], ans:2, exp:"A 34-hour restart resets the 60/70-hour on-duty clock, allowing you to start a new duty cycle." },
      ]}, ]},
    { id:"b12", title:"Roadside Inspections and DOT", icon:"👮", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"Every commercial driver will be inspected at some point. The." },
      { type:"steps", title:"The 6 Levels of Inspection", items:[
        "Level 1 - Full inspection: Driver and vehicle. Most thorough. Takes 45-60 minutes.",  "Level 2 - Walk-around: Inspector walks around but does not go under vehicle.",
        "Level 3 - Driver only: License, medical card, HOS logs, seatbelt.",  "Level 4 - Special study: Specific item being studied for safety data.",
        "Level 5 - Vehicle only: No driver present required.",  "Level 6 - Radiological: For vehicles hauling radioactive materials."
      ]}, { type:"steps", title:"Top Out-of-Service Violations", items:[
        "1. HOS violations - falsified or insufficient hours of service.",  "2. Brake violations - out of adjustment, air leaks, missing components.",
        "3. Tire violations - tread depth below minimums, flat tires, exposed cords.",  "4. Lighting violations - brake lights, head lights, marker lights not working.",
        "5. Cargo securement - improper tie-downs, overweight, unsecured load.",  "6. Driver condition - fatigue, impairment, missing medical certificate."
      ]},
      { type:"tip", title:"Big Earl Says", text:"When a DOT officer pulls you over, be professional, be." },
      { type:"quiz", questions:[ { q:"A Level 1 inspection is:", opts:["Vehicle only","Driver only","Full driver and vehicle inspection","Hazmat specific only"], ans:2, exp:"Level 1 is a full inspection covering both driver credentials and the entire vehicle. It takes 45-60 minutes." },
        { q:"Which violation most commonly puts drivers out of service?", opts:["Dirty truck","Broken CB radio","HOS violations and brake defects","Missing coffee thermos"], ans:2, exp:"HOS violations and brake defects are the top out-of-service violations during DOT inspections." },
        { q:"During a DOT stop, what documents must be ready?", opts:["Just your license","License and medical card only","License, medical card, registration, IFTA, BOL, and 8 days of logs","Only your ELD"], ans:2, exp:"Have all documents organized: license, medical card, registration, IFTA, bill of lading, and last 8." },
        { q:"A drug and alcohol test is federally required after an accident with:", opts:["Any fender bender","Only fatalities","Injury, fatality, or vehicle towed","Only if police request it"], ans:2, exp:"Federal law requires drug and alcohol testing within 8 hours after accidents involving injury,." },
      ]}, ]},

    { id:"b13", title:"Mirrors and Blind Spots", icon:"🪞", duration:"4 min read", xp:75, content:[
      { type:"intro", text:"A truck has four major blind spots that can hide entire." },
      { type:"steps", title:"The Four Blind Zones", items:[
        "1. FRONT - 20 feet directly in front of the cab. Never visible from the.",  "2. REAR - 30 feet directly behind the trailer. No rear window, no rear.",
        "3. RIGHT SIDE - Largest blind spot. Extends from the cab to beyond the.",  "4. LEFT SIDE - Smaller than right but still dangerous. Runs alongside the."
      ]}, { type:"steps", title:"The 2x4 Mirror Rule", items:[
        "Left mirror: You should see 2 lanes of traffic behind you.",  "Right mirror: You should see 4 lanes of traffic behind you.",
        "If you see less - your mirrors are not adjusted correctly. Fix before moving.",  "Flat mirrors show what is behind. Convex (curved) mirrors show a wider angle but distort distance.",
        "Check mirrors every 5-8 seconds minimum. More often in traffic and during lane changes."
      ]}, { type:"steps", title:"Before Every Lane Change", items:[
        "1. Check mirrors - both left and right.",  "2. Signal - minimum 4 seconds before moving.",
        "3. Check mirrors again - positions change fast.",  "4. Move slowly - never jerk the wheel.",
        "5. Watch your trailer swing - rear of trailer cuts in opposite direction of turn."
      ]},
      { type:"tip", title:"Big Earl Says", text:"I have seen drivers with 10 years experience get into accidents." },
      { type:"quiz", questions:[ { q:"How far does the blind spot extend directly in front of a truck?", opts:["10 feet","20 feet","30 feet","40 feet"], ans:1, exp:"The front blind spot extends approximately 20 feet directly in front of the cab. Always ensure." },
        { q:"The largest blind spot on a truck is:", opts:["Directly behind the trailer","Directly in front","The right side","The left side"], ans:2, exp:"The right side blind spot is the largest, extending from the cab all the way past the end of the." },
        { q:"Using the 2x4 mirror rule, your right mirror should show:", opts:["2 lanes","3 lanes","4 lanes","1 lane"], ans:2, exp:"Your right mirror should show approximately 4 lanes of traffic to ensure maximum visibility on your." },
        { q:"How often should you check your mirrors while driving?", opts:["Once per minute","Every 5-8 seconds","Only when changing lanes","Every 30 seconds"], ans:1, exp:"Check mirrors every 5-8 seconds. Conditions change rapidly and frequent mirror checks give you the." },
      ]}, ]},
    { id:"b14", title:"Space Management", icon:"📏", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"An 80,000 lb truck traveling at 65 mph takes 525 feet to stop -." },
      { type:"steps", title:"Following Distance Rules", items:[
        "One second of following distance for every 10 feet of vehicle length at speeds under 40 mph.",  "At highway speeds, add 1 additional second - so a 60-foot truck needs 7+ seconds following distance.",
        "In bad weather - double your following distance minimum.",  "If you cannot see the road beyond the vehicle ahead, you are too close.",
        "Tailgating a car is how truckers cause multiple-fatality accidents." ]}, { type:"steps", title:"The Cushion of Safety", items:[
        "FRONT: Maintain enough distance to stop safely - never less than 6 seconds at highway speed.",  "REAR: Check mirrors. If someone is tailgating you, slow gradually to increase front space.",
        "SIDES: Stay away from vehicle clusters. Find open space - do not ride alongside other vehicles.",  "OVERHEAD: Know your height (typically 13.5-14 feet). Check clearances before bridges and overhangs.",
        "UNDERNEATH: Watch for raised railroad crossings, dips, and low clearances." ]},
      { type:"steps", title:"Intersection Space Management", items:[
        "Never enter an intersection unless you can fully clear it - never block the box.",  "At red lights, stop so you can see the rear tires of the vehicle ahead touching the pavement.",
        "Right turns require wide arcs - watch for cyclists and pedestrians on the right.",  "Left turns from multilane roads require watching that your trailer clears the median."
      ]},
      { type:"tip", title:"Big Earl Says", text:"Six seconds of following distance sounds like a lot until you." },
      { type:"quiz", questions:[ { q:"At highway speed, a 60-foot truck needs at least how many seconds of following distance?", opts:["4 seconds","5 seconds","7 seconds","10 seconds"], ans:2, exp:"One second per 10 feet of vehicle length plus 1 extra second at highway speed. A 60-foot truck." },
        { q:"An 80,000 lb truck at 65 mph takes approximately how far to stop?", opts:["200 feet","350 feet","525 feet","700 feet"], ans:2, exp:"A fully loaded truck at highway speed takes approximately 525 feet to stop - nearly two football." },
        { q:"When someone is tailgating you, you should:", opts:["Brake check them","Speed up to create space","Gradually slow down to increase your front cushion","Pull over immediately"], ans:2, exp:"Gradually slow down to increase the space in front of you. This gives you more stopping room and." },
        { q:"You should never enter an intersection unless:", opts:["The light is green","You can fully clear it before the light changes","Traffic is light","You have the right of way"], ans:1, exp:"Never block an intersection. Only enter if you can completely clear it. Blocking an intersection is." },
      ]}, ]},
    { id:"b15", title:"Skid Control and Recovery", icon:"⚠️", duration:"4 min read", xp:85, content:[
      { type:"intro", text:"A jackknife or skid in a loaded truck happens in seconds and can." },
      { type:"steps", title:"Why Skids Happen", items:[
        "Over-braking - wheels lock up, tires stop rotating, vehicle slides.",  "Over-acceleration - drive wheels spin, traction breaks, trailer pushes tractor sideways.",
        "Over-steering - turning too sharply causes trailer to push outward.",  "Speed too fast for conditions - especially on curves and wet or icy roads.",
        "Improper load distribution - shifted cargo changes how the truck handles braking and turning."
      ]}, { type:"steps", title:"Tractor Jackknife - What To Do", items:[
        "CAUSE: Drive wheels lock during hard braking, causing tractor to slide sideways.",  "FEEL: Steering suddenly goes light, truck starts rotating.",
        "ACTION: Release the brakes immediately. Do not steer - let wheels rotate first.",  "Then steer gently to straighten the tractor.",
        "PREVENTION: Never brake hard on slippery surfaces. Brake early and gradually." ]},
      { type:"steps", title:"Trailer Skid - What To Do", items:[
        "CAUSE: Trailer wheels lock, trailer slides outward (swings).",  "FEEL: Trailer pushes tractor off course, rear end swings wide.",
        "ACTION: Release trailer brakes, do not accelerate, steer into the skid direction.",  "PREVENTION: Avoid sudden brake applications. Adjust speed before curves, not in them.",
        "ABS helps prevent lockup but does not eliminate the need for proper braking technique."
      ]},
      { type:"tip", title:"Big Earl Says", text:"The worst thing you can do in a skid is panic and mash the." },
      { type:"quiz", questions:[
        { q:"The most common cause of a tractor jackknife is:", opts:["Driving too slowly","Drive wheels locking during hard braking","Steering too gently","Driving in clear weather"], ans:1, exp:"A tractor jackknife occurs when the drive wheels lock up during hard braking, causing the tractor." },
        { q:"When you feel a jackknife beginning, you should immediately:", opts:["Brake harder","Steer sharply to the left","Release the brakes","Accelerate out of it"], ans:2, exp:"Release the brakes immediately to allow the wheels to rotate again. Locked wheels have no steering." },
        { q:"ABS (Anti-lock Braking System) in a truck:", opts:["Eliminates the need for braking technique","Prevents wheel lockup but not all skids","Automatically steers the truck","Is only for cars"], ans:1, exp:"ABS prevents wheel lockup during hard braking but does not eliminate skids caused by speed, load." },
        { q:"A trailer skid occurs when:", opts:["The tractor wheels lock","The trailer wheels lock and the trailer swings outward","The steering wheel locks","The engine loses power"], ans:1, exp:"A trailer skid happens when trailer wheels lock up, causing the trailer to swing outward like a." },
      ]}, ]},
    { id:"b16", title:"Shifting and Transmission", icon:"⚙️", duration:"4 min read", xp:75, content:[
      { type:"intro", text:"Most new trucks are automatic but millions of older trucks still." },
      { type:"steps", title:"Manual Transmission Basics", items:[
        "Most manual trucks have 9, 10, 13, or 18 speeds - not like a car.",  "Double clutching: press clutch, shift to neutral, release clutch, rev match, press clutch again,.",
        "Float shifting: shifting without using the clutch by matching RPMs perfectly - used by experienced drivers.",  "Never force gears - if it does not go in smoothly, your RPMs are wrong.",
        "Engine brake (Jake brake): compression release slows truck without brakes - use on downgrades."
      ]}, { type:"steps", title:"When to Shift", items:[
        "Upshift: when engine reaches the top of the RPM power band - typically 1,400-1,700 RPM.",  "Downshift: when engine drops to the bottom of the power band - typically 1,000-1,200 RPM.",
        "Going uphill: shift down before you need to, not after you lose speed.",  "Going downhill: select your gear at the top before descending - same gear as going up.",
        "Starting on a hill: use low gear and release clutch slowly to avoid rolling back."
      ]}, { type:"steps", title:"Automatic Transmission Tips", items:[
        "Most new trucks use Eaton Fuller Ultrashift or Allison automatics.",  "Do not manually override the transmission unless you know what you are doing.",
        "Engine brake setting: start with low setting in normal conditions, higher setting on steep grades.",  "Allow the transmission to warm up in cold weather before heavy hauling.",
        "Maintain transmission fluid per manufacturer schedule - it is not check-and-forget."
      ]},
      { type:"tip", title:"Big Earl Says", text:"I learned on a 13-speed and I am glad I did. When I drove for a." },
      { type:"quiz", questions:[
        { q:"Double clutching in a manual truck means:", opts:["Pressing the clutch twice quickly","Press clutch, shift to neutral, release, rev match, press clutch, shift to gear","Using both feet on the clutch","Skipping gears"], ans:1, exp:"Double clutching synchronizes transmission gears for smooth shifts. Press clutch, move to neutral,." },
        { q:"You should upshift a manual truck when:", opts:["Speed drops below 30 mph","Engine reaches the top of the RPM power band","The truck starts shaking","Every 2 minutes"], ans:1, exp:"Upshift when the engine reaches the top of the power band, typically 1,400-1,700 RPM depending on." },
        { q:"Going downhill in a manual truck, you should select your gear:", opts:["At the bottom of the grade","Halfway down","At the top before descending","In neutral to save fuel"], ans:2, exp:"Select your descent gear at the top of the grade before you start going down. Never try to." },
        { q:"An engine brake (Jake brake) is used primarily:", opts:["To accelerate quickly","To slow the truck on downgrades without using service brakes","Only in emergency stops","To start the engine in cold weather"], ans:1, exp:"Engine brakes use compression to slow the truck, reducing heat buildup in service brakes on long." },
      ]}, ]},
    { id:"b17", title:"Basic Vehicle Control", icon:"🎯", duration:"4 min read", xp:75, content:[
      { type:"intro", text:"A 70-foot combination vehicle handles nothing like a car. The." },
      { type:"steps", title:"Turning a Truck", items:[
        "Right turns: pull past the intersection further than feels natural, then turn. Trailer wheels track.",  "Left turns: stay in the right portion of your lane to give the trailer room to swing.",
        "The longer the trailer, the wider the turn arc needed - always.",  "Watch your right mirror when turning right - watch for the trailer cutting the curb.",
        "Never attempt a turn you have not confirmed you can complete." ]}, { type:"steps", title:"Highway Merging", items:[
        "Trucks cannot accelerate like cars - plan your merge early.",  "Match the speed of highway traffic before entering - never force a merge.",
        "Use the full length of the acceleration lane.",  "Signal early - give highway drivers time to make room.",
        "If the gap is not big enough, slow and wait for the next gap." ]}, { type:"steps", title:"Lane Changes at Speed", items:[
        "Check both mirrors and signal at least 4 seconds before moving.",  "Move smoothly - sudden lane changes can shift cargo and destabilize the trailer.",
        "Do not change lanes on curves, bridges, or in heavy traffic unless necessary.",  "After changing lanes, verify your trailer has cleared the lane.",
        "Never cut off another driver - your stopping distance is 10x longer than theirs."
      ]},
      { type:"tip", title:"Big Earl Says", text:"New drivers make right turns too tight every single time. They." },
      { type:"quiz", questions:[
        { q:"When making a right turn in a truck, you should:", opts:["Turn as early as possible","Pull past the intersection further than normal before turning","Turn sharply to save time","Use the left lane to start the turn"], ans:1, exp:"Pull further past the intersection than feels normal before beginning the right turn. This gives." },
        { q:"When merging onto a highway, you should:", opts:["Force your way in","Match highway traffic speed using the full acceleration lane","Stop at the end of the ramp and wait","Merge slowly at 45 mph"], ans:1, exp:"Use the full acceleration lane to match highway speed before merging. Never force a merge - find an." },
        { q:"How far in advance should you signal before a lane change?", opts:["1 second","2 seconds","4 seconds","10 seconds"], ans:2, exp:"Signal at least 4 seconds before making a lane change. This gives other drivers time to react to." },
        { q:"After completing a lane change, you should:", opts:["Signal again","Verify your trailer has fully cleared the lane","Speed up","Check your fuel gauge"], ans:1, exp:"Always verify your trailer has completely cleared the lane before straightening out. The trailer." },
      ]}, ]}, ], company:[
    { id:"c1", title:"Advanced Trip Planning", icon:"🗺️", duration:"2 min read", xp:50, content:[
      { type:"intro", text:"Professional trip planning adds 10-20% to your earnings." },
      { type:"steps", title:"The Professional Planning Checklist", items:[
        "Load Review - Study the BOL, special handling notes, receiver hours before accepting.",  "Route Planning - PC Miler or Rand McNally only. Google Maps will get you killed on a bridge.",
        "Fuel Strategy - Plan stops 300-350 miles apart. Check truck stop diesel prices via apps.",  "HOS Math - Calculate arrival time with required breaks built in before you leave.",
        "Weather Window - Check mountain pass forecasts 24 hours out. Have an alternate route.",  "Receiver Recon - Call ahead on long hauls. Know the dock number, check-in procedure.",
      ]},
      { type:"tip", text:"I plan every trip the night before. Route, fuel, rest stops,." },
      { type:"quiz", q:"What tool should professional truck drivers use for routing?", opts:["Google Maps","Apple Maps","PC Miler or Rand McNally","Waze"], ans:2, exp:"Commercial truck routing software like PC Miler or Rand McNally accounts for vehicle height,." },
    ]},
    { id:"c2", title:"Defensive Driving for CMVs", icon:"🛡️", duration:"2 min read", xp:75, content:[
      { type:"intro", text:"In a crash between a semi and a car, the driver of the semi is." },
      { type:"steps", title:"Professional Defensive Driving Principles", items:[
        "Smith System - Aim high in steering, get the big picture, keep your eyes moving.",  "Space Cushion - Maintain buffers on all 4 sides. Merge into your space, never beside another truck.",
        "Four-Wheeler Behavior - Predict blind spot merges. Expect cars to cut you off at exits.",  "Adverse Weather Protocol - Reduce speed 25% in rain, 50% in snow. No exceptions.",
        "Fatigue Recognition - If you yawn 3 times in 5 minutes, pull over. Sleep deprivation kills.",  "Distracted Driving - Federal law bans hand-held phone use while driving CMV. Period.",
      ]},
      { type:"tip", text:"Assume every four-wheeler driver cannot see you. Because most of." },
      { type:"quiz", q:"Approximately how much should you reduce speed in snowy conditions?", opts:["10%","25%","50%","You should not drive in snow"], ans:2, exp:"FMCSA recommends reducing speed by approximately 50% in snow and ice. A truck that cannot stop." },
    ]},
    { id:"c3", title:"Dock and Shipper Relations", icon:"🤝", duration:"2 min read", xp:40, content:[
      { type:"intro", text:"Your reputation at docks travels faster than you do. The drivers." },
      { type:"steps", title:"Professional Dock Conduct", items:[
        "Check-In Right - Know the procedure before you arrive. Guard shack, door office, or app.",  "BOL Accuracy - Count your pieces. Note damage before signing. This is your legal protection.",
        "Dock Patience - Dock workers control your time. Attitude costs you hours.",  "Seal Procedures - Record seal numbers on your BOL and photograph them.",
        "Detention Tracking - Log your arrival time immediately. Detention pay requires documentation.",  "Professionalism - Clean cab, professional appearance. You represent your company every time.",
      ]},
      { type:"tip", text:"I have been loaded in 20 minutes at docks where other drivers." },
      { type:"quiz", q:"What should you do before signing the Bill of Lading?", opts:["Sign it and check later","Count pieces and note any damage first","Just accept what the shipper says","Call your dispatcher first"], ans:1, exp:"Always physically count pieces and note any pre-existing damage on the BOL before signing. Once you." },
    ]},
    { id:"c4", title:"Roadside Inspections", icon:"🚔", duration:"2 min read", xp:65, content:[
      { type:"intro", text:"FMCSA roadside inspections affect your CSA score, your company's." },
      { type:"steps", title:"DOT Inspection Levels", items:[
        "Level 1 - Full inspection: driver, vehicle, cargo. Most common at weigh stations.",  "Level 2 - Walk-around only, no under-vehicle check. Common at roadside pulloffs.",
        "Level 3 - Driver only: license, HOS logs, medical cert, seatbelt, drug/alcohol.",  "Level 4 - Special study inspection. Targeted for research purposes.",
        "Level 5 - Vehicle-only inspection. Usually at terminals with no driver present.",  "Always have ready: CDL, medical cert, registration, insurance, IFTA decals, ELD.",
      ]},
      { type:"tip", text:"Be polite, be prepared, and be professional. Inspectors have." },
      { type:"quiz", q:"Which CSA Behavior Analysis category carries the most weight?", opts:["Vehicle Maintenance","Unsafe Driving","HOS Compliance","Driver Fitness"], ans:1, exp:"Unsafe Driving violations carry the highest severity weights in the CSA scoring system, including." },
    ]},

    { id:"c5", title:"Cargo Securement", icon:"📦", duration:"4 min read", xp:85, content:[
      { type:"intro", text:"Unsecured cargo kills people. A shifting load can flip your." },
      { type:"steps", title:"Working Load Limit Rules", items:[
        "Aggregate WLL of all tie-downs must equal at least half the cargo weight.",  "Cargo up to 10 feet long: minimum 2 tie-downs regardless of weight.",
        "Each additional 10 feet of cargo: add 1 more tie-down.",  "Tie-downs must prevent forward, rearward, sideways, and vertical movement.",
        "Binders must be sealed or locked - vibration can open unsecured binders." ]}, { type:"steps", title:"Special Cargo Rules", items:[
        "Flatbed steel: Edge protection required where straps contact metal.",  "Lumber: Cannot extend more than 1/3 of load length beyond rear of trailer.",
        "Logs: Must use stakes, wrappers, or bolsters rated for the load weight.",  "Vehicles: Must be chocked or secured at all 4 tires plus chain.",
        "Oversized: Requires escort, permits, and flags before moving." ]},
      { type:"tip", title:"Big Earl Says", text:"Do a cargo check every 150 miles or at every stop. Straps." },
      { type:"quiz", questions:[
        { q:"The aggregate Working Load Limit of all tie-downs must equal at least:", opts:["One quarter of cargo weight","One third of cargo weight","One half of cargo weight","Full cargo weight"], ans:2, exp:"Total WLL of all securement devices must equal at least half the weight of the cargo being secured." },
        { q:"Cargo up to 10 feet long requires a minimum of how many tie-downs?", opts:["1","2","3","4"], ans:1, exp:"A minimum of 2 tie-downs is required regardless of weight for cargo up to 10 feet in length." },
        { q:"When should you perform a cargo check after departure?", opts:["Never - dock workers handle it","Every 500 miles","Every 150 miles or at each stop","Only at destination"], ans:2, exp:"Check cargo every 150 miles or at every stop. Straps loosen with vibration and loads shift during transport." },
        { q:"Edge protection is required when:", opts:["Always","Only on flatbeds","When straps contact metal edges","Only for heavy cargo"], ans:2, exp:"Edge protection must be used wherever tie-down straps contact sharp metal edges to prevent cutting." },
      ]}, ]},
    { id:"c6", title:"ELD Compliance and Violations", icon:"📱", duration:"5 min read", xp:90, content:[
      { type:"intro", text:"Since December 2017, most commercial drivers are required to use." },
      { type:"steps", title:"What Your ELD Tracks", items:[
        "Engine hours and vehicle movement - automatically records when truck moves.",  "Driving status - auto-switches to Driving when truck exceeds 5 mph.",
        "Location - recorded at every change of duty status.",  "Unassigned miles - any movement without a logged-in driver flags as unassigned.",
        "Edit history - every manual edit is recorded and timestamped. Inspectors see all edits."
      ]}, { type:"steps", title:"Common ELD Violations", items:[
        "1. Unassigned driving - miles recorded but not assigned to a driver.",  "2. Personal conveyance misuse - using PC status for business movements.",
        "3. Form and manner errors - missing required fields (home terminal, carrier info).",  "4. Failure to transfer data - inability to send logs to inspector via.",
        "5. Driving during off-duty - ELD shows movement during logged off-duty period."
      ]},
      { type:"tip", title:"Big Earl Says", text:"Personal conveyance is for personal use only. I know dispatchers." },
      { type:"quiz", questions:[ { q:"Your ELD automatically switches to Driving status when your truck exceeds:", opts:["0 mph","3 mph","5 mph","10 mph"], ans:2, exp:"The ELD automatically records Driving status when the vehicle exceeds 5 mph. You cannot manually." },
        { q:"Personal conveyance (PC) status is legal when:", opts:["Repositioning truck for the company","Driving to a shipper pickup","Going to a personal destination while off duty","Any slow-speed movement"], ans:2, exp:"PC is only for personal use while off duty. Any movement that benefits the carrier is on-duty and." },
        { q:"ELD edit history is:", opts:["Deleted after 30 days","Visible only to the carrier","Permanently recorded and visible to inspectors","Automatically corrected"], ans:2, exp:"Every manual edit is permanently timestamped and recorded. DOT inspectors can see all edits during." },
        { q:"Unassigned driving on your ELD means:", opts:["You drove with a co-driver","Miles were recorded with no logged-in driver","You used personal conveyance","Your ELD had a malfunction"], ans:1, exp:"Unassigned miles are recorded vehicle movement with no driver logged in. These flag as violations." },
      ]}, ]},
    { id:"c7", title:"Accident Procedures", icon:"🚨", duration:"4 min read", xp:85, content:[
      { type:"intro", text:"How you handle the first 15 minutes after an accident will." },
      { type:"steps", title:"Immediate Response - In Order", items:[
        "1. Check for injuries - your safety first, then others. Do not move.",  "2. Secure the scene - hazard lights on, set triangles at 10, 100, and 200.",
        "3. Call 911 - even minor accidents involving a commercial vehicle may.",  "4. Notify your carrier immediately - company safety department must be.",
        "5. Document everything - photos of all vehicles, road conditions, skid.",  "6. Do NOT admit fault - say nothing about what happened to anyone except.",
        "7. Drug and alcohol test - federally required within 8 hours of any." ]},
      { type:"tip", title:"Big Earl Says", text:"The other driver will have an attorney within 48 hours. Your." },
      { type:"quiz", questions:[ { q:"After an accident, your FIRST priority is:", opts:["Call your dispatcher","Take photos","Check for injuries and secure the scene","Call an attorney"], ans:2, exp:"Check for injuries and secure the scene first - hazards on, triangles out. Then notify your carrier." },
        { q:"At an accident scene, you should tell other drivers:", opts:["Exactly what happened","Nothing about the accident itself","Your insurance policy number","Your carrier's phone number"], ans:1, exp:"Do not admit fault or describe what happened to anyone except police and your carrier's safety department." },
        { q:"A post-accident drug test is required within:", opts:["2 hours for alcohol, 32 hours for drugs","8 hours for alcohol, 32 hours for drugs","24 hours for both","Only if requested by police"], ans:1, exp:"Federal regulations require alcohol testing within 2 hours and drug testing within 32 hours after a." },
        { q:"Triangles should be placed at:", opts:["10, 50, 100 feet","10, 100, 200 feet","50, 100, 500 feet","25, 50, 100 feet"], ans:1, exp:"Place warning triangles at 10 feet (immediate), 100 feet (approaching), and 200 feet behind the vehicle." },
      ]}, ]},
    { id:"c8", title:"Driver Health and Fatigue", icon:"💪", duration:"4 min read", xp:70, content:[
      { type:"intro", text:"Fatigued driving kills. FMCSA estimates 13% of commercial truck." },
      { type:"steps", title:"Fatigue Warning Signs", items:[
        "Difficulty keeping eyes open or focused - immediate stop required.",  "Missing exits or signs you just passed - your brain is already micro-sleeping.",
        "Drifting between lanes or hitting rumble strips.",  "Inability to remember the last few miles.",
        "Irritability or aggression - emotional regulation drops before physical control."
      ]}, { type:"steps", title:"Staying Healthy on the Road", items:[
        "Sleep: 7-9 hours in your sleeper counts - but cab temperature, noise, and light matter.",  "Diet: Protein and fat keep you alert. Sugar and simple carbs cause energy crashes.",
        "Hydration: Dehydration causes fatigue. Drink water, not just coffee.",  "Exercise: Even 15 minutes of walking at each stop improves circulation and alertness.",
        "DOT Medical: Keep blood pressure, blood sugar, and vision in compliance or you lose your card."
      ]},
      { type:"tip", title:"Big Earl Says", text:"I drove tired for years because I thought it was toughness. It." },
      { type:"quiz", questions:[ { q:"FMCSA estimates what percentage of commercial truck accidents involve a fatigued driver?", opts:["5%","13%","20%","25%"], ans:1, exp:"FMCSA estimates approximately 13% of commercial truck accidents involve driver fatigue as a." },
        { q:"Which is the most dangerous time of day for fatigue?", opts:["Mid-morning","Early afternoon","Midnight to 6 AM","Late evening"], ans:2, exp:"Fatigue is most severe between midnight and 6 AM due to natural circadian rhythm dips in alertness." },
        { q:"Missing exits you just passed is a warning sign of:", opts:["GPS malfunction","Micro-sleeping","Distracted driving","Caffeine overdose"], ans:1, exp:"Missing recent exits means your brain is already micro-sleeping - brief unconscious periods. Stop immediately." },
        { q:"The recommended strategy for managing fatigue on long runs is:", opts:["Drink more coffee","Take 10-20 minute power naps at rest stops","Drive faster to finish sooner","Use stimulant supplements"], ans:1, exp:"Short 10-20 minute power naps are scientifically proven to restore alertness better than caffeine alone." },
      ]}, ]},
    { id:"c9", title:"Professional Communication", icon:"📞", duration:"3 min read", xp:65, content:[
      { type:"intro", text:"Your ability to communicate professionally with dispatchers,." },
      { type:"steps", title:"Communicating with Dispatch", items:[
        "Report problems early - a dispatcher cannot help you if you tell them at the last minute.",  "Be specific - do not say 'I am running late.' Say 'I will be 2 hours late due to traffic backup on I-40.'",
        "Ask questions before accepting a load - know the rate, pickup and delivery windows, and any special.",  "Document everything in writing - follow verbal agreements with a text or message.",
        "Push back professionally - if a load is unsafe or illegal, say so clearly and calmly."
      ]}, { type:"steps", title:"At the Dock", items:[
        "Call ahead - always call the receiver 30-60 minutes before arrival.",  "Check in immediately - introduce yourself, have your paperwork ready.",
        "Stay professional during delays - dock workers and receivers remember difficult drivers.",  "Inspect the load before signing - note any damage on the BOL before your signature."
      ]},
      { type:"tip", title:"Big Earl Says", text:"Your reputation follows you in this industry. Dispatchers talk." },
      { type:"quiz", questions:[
        { q:"When reporting a delay to dispatch, you should say:", opts:["I am running late","I will be 2 hours late due to I-40 backup near Memphis","No problem, I will figure it out","Wait until you arrive"], ans:1, exp:"Always give specific information: how late, where you are, and the reason. Dispatchers need details." },
        { q:"Before signing a Bill of Lading at pickup, you should:", opts:["Sign quickly to save time","Inspect and note any existing damage first","Trust the shipper's count","Only check the weight"], ans:1, exp:"Always inspect cargo before signing. Note any damage, discrepancies, or issues on the BOL before." },
        { q:"When should you call a receiver before delivery?", opts:["Only if you are late","30-60 minutes before arrival","When you arrive","Dispatch handles all calls"], ans:1, exp:"Call 30-60 minutes before arrival. Dock workers and receivers can prepare and your professionalism." },
        { q:"If a dispatcher pressures you to violate HOS rules, you should:", opts:["Comply to keep your job","Refuse clearly and document it","Ask another driver to cover","Ignore them and drive anyway"], ans:1, exp:"You have the legal right to refuse. Document the request in writing. HOS violations are your." },
      ]}, ]},
    { id:"c10", title:"Fuel Management and Trip Planning", icon:"⛽", duration:"4 min read", xp:75, content:[
      { type:"intro", text:"Fuel is your single largest operating expense whether you own." },
      { type:"steps", title:"Smart Fueling Strategy", items:[
        "Fuel at lowest-cost states - California, Pennsylvania, and New York diesel is consistently expensive.",  "Use fuel cards - carrier fuel cards often include discounts of 10-40 cents per gallon.",
        "Never run below 1/4 tank in remote areas - mountain routes can have 100+ miles between stops.",  "Fuel at truck stops, not highway gas stations - scales, parking, and restrooms matter.",
        "Top off before sleep - fuel prices change overnight. Lock in the current price."
      ]}, { type:"steps", title:"Trip Planning Basics", items:[
        "Plan your route before dispatch confirms - know your HOS window and whether the load is achievable.",  "Identify rest stops in advance - running out of HOS with nowhere legal to park is a violation.",
        "Check size and weight restrictions - some routes restrict oversized loads by time of day.",  "Check weather for entire route - not just your current location.",
        "Have a backup plan - what do you do if your receiver is closed or has no dock appointment?"
      ]},
      { type:"tip", title:"Big Earl Says", text:"The drivers who make the most money are not the fastest drivers.." },
      { type:"quiz", questions:[
        { q:"Which states consistently have the highest diesel fuel prices?", opts:["Texas and Oklahoma","California and Pennsylvania","Florida and Georgia","Nevada and Utah"], ans:1, exp:"California and Pennsylvania consistently rank among the highest diesel prices. Texas and New Jersey." },
        { q:"What is the recommended minimum fuel level before entering remote mountain routes?", opts:["Empty to 1/8 tank","1/8 to 1/4 tank","1/4 tank minimum","1/2 tank minimum"], ans:2, exp:"Never drop below 1/4 tank before remote routes. Mountain corridors can have 100+ miles between fuel stops." },
        { q:"The best time to plan your rest stop locations is:", opts:["When you run out of hours","At the end of your shift","Before you accept the load","When dispatch calls"], ans:2, exp:"Plan rest stops before you accept the load. Running out of hours with nowhere legal to park is a." },
        { q:"Carrier fuel cards typically offer savings of:", opts:["1-3 cents per gallon","5-10 cents per gallon","10-40 cents per gallon","50+ cents per gallon"], ans:2, exp:"Carrier fuel cards often include network discounts of 10-40 cents per gallon, saving thousands annually." },
      ]}, ]},

    { id:"c11", title:"Understanding Your Paycheck", icon:"💵", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"Most company drivers do not fully understand their own." },
      { type:"steps", title:"How Drivers Are Paid", items:[
        "CPM (Cents Per Mile): Most common. Paid per loaded mile driven. Empty miles often paid at lower rate.",  "Percentage of load: Paid a percentage of what the load pays. Common in owner-operator leases.",
        "Hourly: Rare in trucking. Used in local delivery and some specialty operations.",  "Salary: Fixed weekly or monthly pay regardless of miles. Common in dedicated routes.",
        "Team pay: Solo rate split between two drivers or a higher team rate divided equally."
      ]}, { type:"steps", title:"Additional Pay You Are Owed", items:[
        "Detention pay: After 2 free hours at a shipper or receiver, you should be paid per hour.",  "Layover pay: If held at a location overnight through no fault of yours.",
        "Stop pay: Additional pay for each stop beyond the first on a multi-stop load.",  "Breakdown pay: Some carriers pay while you wait for repairs.",
        "Tarp pay: Extra pay for tarping flatbed loads.",  "Hazmat pay: Additional per-mile premium for hauling hazardous materials."
      ]}, { type:"steps", title:"Reading Your Settlement", items:[
        "Verify every mile matches your records - odometer or ELD miles.",  "Check every deduction line - insurance, truck lease, escrow, advances.",
        "Escrow deductions should be clearly stated in your contract.",  "Fuel surcharge should be paid to you if you paid for your own fuel.",
        "If something does not match - ask immediately. Most errors go unresolved after 30 days."
      ]},
      { type:"tip", title:"Big Earl Says", text:"I drove for a carrier for two years before I realized they were." },
      { type:"quiz", questions:[ { q:"CPM stands for:", opts:["Cost per month","Cents per mile","Carrier payment method","Commercial pay metric"], ans:1, exp:"CPM means Cents Per Mile. It is the most common pay structure for company drivers. Know your CPM." },
        { q:"Detention pay typically begins after how many free hours at a shipper?", opts:["1 hour","2 hours","4 hours","8 hours"], ans:1, exp:"Most carriers begin paying detention after 2 free hours at a shipper or receiver. After that,." },
        { q:"If your settlement does not match your records, you should:", opts:["Ignore small discrepancies","Ask immediately - errors rarely get resolved after 30 days","Wait until end of year","Accept it as normal"], ans:1, exp:"Address discrepancies immediately. Most carriers have a limited window to correct pay errors.." },
        { q:"Escrow deductions are:", opts:["Always illegal","Mandatory carrier fees","Money withheld by the carrier as a security deposit, stated in your contract","A type of detention pay"], ans:2, exp:"Escrow is money withheld from your pay as a security deposit against potential chargebacks or." },
      ]}, ]},
    { id:"c12", title:"Load Planning and Weight Distribution", icon:"⚖️", duration:"5 min read", xp:85, content:[
      { type:"intro", text:"An overweight or improperly loaded truck is illegal, dangerous,." },
      { type:"steps", title:"Federal Weight Limits", items:[
        "Gross Vehicle Weight (GVW): 80,000 lbs maximum on interstate highways.",  "Steer axle: 12,000 lbs maximum.",
        "Single drive axle: 20,000 lbs maximum.",  "Tandem axles: 34,000 lbs maximum combined.",
        "Trailer tandem axles: 34,000 lbs maximum combined.",  "Bridge formula: limits weight based on distance between axle groups."
      ]}, { type:"steps", title:"How to Scale Your Truck", items:[
        "Pull onto the scale slowly and straight - crooked axles give false readings.",  "Weigh each axle group separately before checking gross.",
        "If overweight on drives, slide the fifth wheel forward (moves weight to steer axle).",  "If overweight on trailer tandems, slide them forward (moves weight to drive axles).",
        "If overweight on steer, slide fifth wheel back or redistribute cargo.",  "Always scale before leaving a shipper if weight is close to limits."
      ]}, { type:"steps", title:"Cargo Placement Rules", items:[
        "Heaviest cargo should go on the floor and toward the front of the trailer.",  "Distribute weight evenly side to side to prevent trailer lean.",
        "Never stack heavy items on top of light fragile items.",  "Verify cargo will not shift during transit - tie down and brace as needed.",
        "For tankers - partial loads create surge that affects braking and handling." ]},
      { type:"tip", title:"Big Earl Says", text:"The scale house is not your enemy. Scale before you leave the." },
      { type:"quiz", questions:[ { q:"The maximum gross vehicle weight on interstate highways is:", opts:["70,000 lbs","75,000 lbs","80,000 lbs","90,000 lbs"], ans:2, exp:"The federal maximum GVW on interstate highways is 80,000 lbs. Individual states may have different." },
        { q:"If your drive axles are overweight, you should:", opts:["Add more cargo","Slide the fifth wheel forward","Slide the fifth wheel rearward","Remove cargo from the trailer"], ans:1, exp:"Sliding the fifth wheel forward shifts weight from the drive axles toward the steer axle. This is." },
        { q:"Tandem axles have a combined maximum weight limit of:", opts:["20,000 lbs","28,000 lbs","34,000 lbs","40,000 lbs"], ans:2, exp:"Tandem axle groups - both drive tandems and trailer tandems - have a combined legal limit of 34,000." },
        { q:"When loading cargo in a trailer, heavy items should go:", opts:["On top of light items","At the rear of the trailer","On the floor toward the front","Stacked as high as possible"], ans:2, exp:"Heavy cargo should be placed on the floor toward the front of the trailer for stability, proper." },
      ]}, ]},
    { id:"c13", title:"Winter Operations", icon:"❄️", duration:"5 min read", xp:85, content:[
      { type:"intro", text:"Winter driving kills more truckers than any other seasonal." },
      { type:"steps", title:"Pre-Trip for Cold Weather", items:[
        "Drain air tanks every day - water in air lines freezes and causes brake failure.",  "Check antifreeze level and strength - should protect to at least -20°F.",
        "Test all lights - visibility is critical and lights ice over quickly.",  "Check tire pressure - pressure drops 1 PSI for every 10°F temperature drop.",
        "Allow engine to warm up before moving - especially in temperatures below 20°F.",  "Carry chains if operating in chain-required areas - know how to put them on."
      ]}, { type:"steps", title:"Driving in Snow and Ice", items:[
        "Reduce speed - posted speed limits assume normal conditions. Cut speed by half on ice.",  "Increase following distance to 10+ seconds - stopping distance multiplies on ice.",
        "Accelerate and decelerate slowly - smooth inputs prevent wheel spin and skids.",  "Never use cruise control on slippery surfaces - it can cause loss of control.",
        "Brake before curves, not in them - braking in a curve on ice is how trucks roll.",  "Watch for black ice - bridge decks freeze before road surfaces."
      ]}, { type:"steps", title:"Chain Laws and Requirements", items:[
        "Most mountain states have chain laws for commercial vehicles - know them before you go.",  "Chain up BEFORE you need to - not after you are already stuck or sliding.",
        "Practice putting on chains before winter - not your first time in a blizzard.",  "Automatic chains (on-demand chains) are available - worth the investment for mountain routes.",
        "Running without chains when required: $500 fine minimum plus liability for any accident."
      ]},
      { type:"tip", title:"Big Earl Says", text:"I have put chains on at 2 AM in a blizzard in Wyoming with 40." },
      { type:"quiz", questions:[
        { q:"Why must air tanks be drained daily in cold weather?", opts:["To check for leaks","Water in air lines can freeze causing brake failure","To reduce air pressure","It is required by FMCSA daily"], ans:1, exp:"Air systems collect moisture that condenses into water. In freezing temperatures this water can." },
        { q:"When driving on ice, you should reduce your speed by:", opts:["10%","25%","At least half","Speed does not need to change"], ans:2, exp:"On ice, reduce speed by at least half of normal and increase following distance to 10 or more." },
        { q:"You should never use cruise control:", opts:["On highways","On slippery or wet surfaces","During daytime","When driving alone"], ans:1, exp:"Cruise control on slippery surfaces can cause wheel spin when it attempts to maintain speed,." },
        { q:"When should you chain up before a mountain pass?", opts:["After you start sliding","When visibility drops","Before you reach the chain-required area","Only when required by law"], ans:2, exp:"Chain up before you reach the chain-required area or before conditions deteriorate. Chaining up." },
      ]}, ]}, ], owner:[
    { id:"o1", title:"Starting Your Business", icon:"🚀", duration:"3 min read", xp:100, content:[
      { type:"intro", text:"You are not just becoming a truck driver. You are becoming a." },
      { type:"steps", title:"Business Setup Sequence", items:[
        "Form an LLC - File with your state ($50-500). Separates personal and business liability.",  "Get EIN - Free at IRS.gov. Required for business banking, taxes, and authority applications.",
        "Business Bank Account - Never mix personal and business money. Ever.",  "DOT Number - Required for interstate commerce. Apply at FMCSA.dot.gov, free.",
        "MC Authority - Form OP-1, costs $300. Required to haul for hire.",  "BOC-3 Filing - Process agent required before authority activates.",
        "UCR Registration - Unified Carrier Registration, required annually by state.", ]},
      { type:"tip", text:"The LLC is not optional. If your truck is in your personal name." },
      { type:"quiz", q:"What is the main financial protection an LLC provides?", opts:["Lower fuel costs","Tax-free income","Separation of personal and business liability","Free DOT registration"], ans:2, exp:"An LLC creates a legal separation between your personal assets and business liabilities. If the." },
    ]},
    { id:"o2", title:"Understanding Your Numbers", icon:"💰", duration:"3 min read", xp:90, content:[
      { type:"intro", text:"Most owner-operators who fail do not fail because they are bad." },
      { type:"steps", title:"The Real Cost Per Mile Breakdown", items:[
        "Fuel - 45-65 cents per mile. Your biggest variable cost. Track MPG obsessively.",  "Truck Payment - 15-30 cents per mile if financed. Cash trucks change your math entirely.",
        "Insurance - 10-20 cents per mile. New authority pays more. Clean record pays less.",  "Tires - 3-5 cents per mile. Budget $500-700 per drive tire, $350 per trailer tire.",
        "Maintenance - 10-15 cents per mile. Preventive maintenance is always cheaper than emergency.",  "Tolls, Permits, Misc - 3-8 cents per mile depending on lanes.",
        "Total All-In Cost - Budget $1.65-2.10 per mile. Never accept less than your break-even.",
      ]},
      { type:"tip", text:"Write your cost per mile number down and tape it inside your." },
      { type:"quiz", q:"What is the most important number every owner-operator must know?", opts:["Gross revenue per week","Cost per mile","Average miles per gallon","Broker commission rate"], ans:1, exp:"Cost per mile is the foundation of all owner-operator profitability decisions. Without it you." },
    ]},
    { id:"o3", title:"Load Boards and Rate Negotiation", icon:"📦", duration:"3 min read", xp:70, content:[
      { type:"intro", text:"The load board is your marketplace. How well you use it." },
      { type:"steps", title:"Load Board Mastery", items:[
        "DAT Power - Industry standard. Best for spot market data and lane rate benchmarking.",  "Truckstop.com - Strong broker database. Good for relationship building.",
        "Rate Per Mile Target - Know your minimum before opening any load board.",  "Counter Strategy - Always counter. First offer is never the best offer.",
        "Broker Credit Check - Check broker payment days (DAT or Truckstop). Avoid 45+ day payers.",  "Building Direct Lanes - After 3 loads with a shipper, ask for a rate agreement directly.",
        "Factoring vs. Quick Pay - Factor at 2-5% or broker quick pay at 2-3% to manage cash flow.",
      ]},
      { type:"tip", text:"Never accept a load you cannot profit on just to keep moving.." },
      { type:"quiz", q:"What should you check before working with a new freight broker?", opts:["Their website design","Their payment history and days to pay","Whether they use DAT or Truckstop","Their office location"], ans:1, exp:"Always check a broker's credit score and average days to pay on DAT or Truckstop before hauling a." },
    ]},
    { id:"o4", title:"Insurance and Legal Protection", icon:"🛡️", duration:"3 min read", xp:85, content:[
      { type:"intro", text:"Insurance is your second-largest operating expense and your most." },
      { type:"steps", title:"Required Insurance Coverage", items:[
        "Primary Liability - Minimum $750K required by FMCSA. Most brokers require $1M.",  "Physical Damage - Covers your truck. Required if you have a lender.",
        "Cargo Insurance - Usually $100K minimum. Check shipper requirements before booking.",  "Bobtail/Non-Trucking Liability - Covers you when operating without a trailer.",
        "Occupational Accident - Acts like workers comp for independent owner-operators.",  "Umbrella Policy - $1-2M additional coverage. Smart for high-value freight lanes.",
        "New Authority Budget - Expect $1,000-1,500/month year one. Drops after 2 clean years.",
      ]},
      { type:"tip", text:"Read your policy. Do not assume you are covered. I know drivers." },
      { type:"quiz", q:"What is the FMCSA minimum liability insurance for a dry van carrier?", opts:["$100,000","$500,000","$750,000","$1,000,000"], ans:2, exp:"FMCSA requires a minimum of $750,000 in public liability insurance for property carriers. However,." },
    ]},
    { id:"o5", title:"Taxes and Business Finance", icon:"📊", duration:"14 min read", xp:95, content:[
      { type:"intro", text:"Self-employment taxes will shock you if you are unprepared. As." },
      { type:"steps", title:"Owner-Operator Tax Essentials", items:[
        "Set Aside 25-30% - Put this in a separate account every week. Non-negotiable.",  "Quarterly Estimated Taxes - Due January, April, June, September. Late = penalties.",
        "Deductible Expenses - Fuel, tolls, maintenance, insurance, phone, per diem meals.",  "Per Diem Deduction - $69/day away from home tax-free. Track every overnight.",
        "Depreciation - Section 179 allows immediate expensing of truck purchase in many cases.",  "Hire a Trucking CPA - Worth $500-1,500/year. They save you 5-10x that in taxes.",
        "Bookkeeping - Use QuickBooks Self-Employed. Reconcile weekly, not at tax time.",
      ]},
      { type:"tip", text:"I saved a driver from a $42,000 tax bill by teaching him to." },
      { type:"quiz", q:"What percentage should an owner-operator set aside for taxes?", opts:["10-15%","15-20%","25-30%","35-40%"], ans:2, exp:"Owner-operators pay self-employment tax (15.3%) plus federal and state income tax. Setting aside." },
    ]},
    { id:"o6", title:"Finding Your First Load", icon:"🎯", duration:"4 min read", xp:85, content:[
      { type:"intro", text:"Your first load as an owner-operator is the hardest one. You." },
      { type:"steps", title:"Where to Find Loads", items:[
        "DAT Load Board - largest in the industry, 400M+ loads per year. Start here.",  "Truckstop.com - second largest, strong on certain lanes.",
        "Direct shippers - harder to get but pay 20-30% more than broker loads.",  "Dispatching services - they find loads for you for 5-10% of gross. Worth it when starting.",
        "Freight matching apps - Convoy, Uber Freight, Amazon Freight for newer operators."
      ]}, { type:"steps", title:"First 90 Days Strategy", items:[
        "1. Accept slightly lower rates at first to build a rating history on load boards.",  "2. Never haul under your cost per mile - know your number before accepting.",
        "3. Always get the rate confirmation in writing before moving.",  "4. Check broker credit scores on DAT before hauling for any new broker.",
        "5. Document every load - BOL, rate confirmation, proof of delivery.",  "6. Follow up on payment within 30 days - do not let receivables age."
      ]},
      { type:"tip", title:"Big Earl Says", text:"The broker is not your friend and not your enemy. They are a." },
      { type:"quiz", questions:[ { q:"What is the largest load board in the trucking industry?", opts:["Truckstop.com","Convoy","DAT Load Board","Amazon Freight"], ans:2, exp:"DAT Load Board is the largest with over 400 million loads posted annually. Most brokers post there first." },
        { q:"Before hauling for a new broker, you should check their:", opts:["Website design","Credit score on DAT","Number of social media followers","Office location"], ans:1, exp:"Always check broker credit scores on DAT before hauling. Slow-pay or no-pay brokers are flagged." },
        { q:"A dispatching service typically charges:", opts:["1-2% of gross","5-10% of gross","15-20% of gross","Flat fee per load"], ans:1, exp:"Dispatching services charge 5-10% of gross revenue. Worth it for new operators who don't yet have." },
        { q:"When receiving a rate confirmation, you should:", opts:["Ignore it and rely on verbal agreement","Sign it and move immediately","Review all terms before signing","Only check the total amount"], ans:2, exp:"Review every detail: rate, pickup/delivery windows, detention terms, fuel surcharge, and." },
      ]}, ]},
    { id:"o7", title:"Fuel Management and IFTA", icon:"⛽", duration:"5 min read", xp:90, content:[
      { type:"intro", text:"IFTA is one of the most confusing parts of running your own." },
      { type:"steps", title:"How IFTA Works", items:[
        "You pay fuel tax at the pump in every state you buy fuel.",  "You owe fuel tax in every state you drive through based on miles driven there.",
        "IFTA reconciles the difference - overpaid means refund, underpaid means you owe.",  "File quarterly: January 31, April 30, July 31, October 31.",
        "Register in your base state BEFORE crossing state lines." ]}, { type:"steps", title:"IFTA Record Keeping", items:[
        "Keep ALL fuel receipts - every gallon in every state must be documented.",  "Track miles by state - your ELD does this automatically.",
        "Maintain trip records for 4 years - IFTA audits look back 4 years.",  "Use trucking software like TruckLogics or Rigbooks to automate calculations.",
        "Fuel in low-tax states when you can plan it - Texas and New Jersey beat California."
      ]},
      { type:"tip", title:"Big Earl Says", text:"Smart fueling can save you $200-400 on a single national run.." },
      { type:"quiz", questions:[ { q:"IFTA quarterly filing deadlines are:", opts:["Jan 1, Apr 1, Jul 1, Oct 1","Jan 31, Apr 30, Jul 31, Oct 31","Mar 15, Jun 15, Sep 15, Dec 15","Monthly"], ans:1, exp:"IFTA is filed quarterly: January 31, April 30, July 31, and October 31 for the previous quarter." },
        { q:"IFTA audit records must be kept for:", opts:["1 year","2 years","4 years","7 years"], ans:2, exp:"Maintain all trip records, fuel receipts, and IFTA filings for 4 years. IFTA audits can look back that far." },
        { q:"When you pay more fuel tax than you owe across all states:", opts:["You pay a penalty","Nothing happens","You receive a refund","You must refile"], ans:2, exp:"If you paid more at the pump than you owe based on miles driven, IFTA sends you a refund check for." },
        { q:"Before crossing state lines, you must:", opts:["Call FMCSA","Register for IFTA in your base state first","Pay all states upfront","Only file at year end"], ans:1, exp:"You must register with your base state's IFTA program before operating across state lines.." },
      ]}, ]},
    { id:"o8", title:"Building Shipper Relationships", icon:"🤝", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"Every load board load costs you broker fees. Every direct." },
      { type:"steps", title:"How to Find Direct Shippers", items:[
        "Drive by industrial parks near your home base and note company names.",  "Look at load board loads - note which companies ship repeatedly on your lanes.",
        "LinkedIn - search for logistics managers and supply chain directors at manufacturers.",  "Cold calls - call the shipping department directly, not customer service.",
        "Start with one lane and one shipper - prove yourself before asking for more." ]},
      { type:"steps", title:"Your Direct Shipper Pitch", items:[
        "Lead with reliability - shippers care about on-time delivery more than price.",  "Offer dedicated capacity - tell them you hold space for them every week.",
        "Price below what brokers charge - you can go lower because there is no middleman.",  "Provide references - even one professional reference accelerates trust.",
        "Document your on-time rate and present it as your track record." ]},
      { type:"tip", title:"Big Earl Says", text:"I built my business on 3 shippers. Three companies that trusted." },
      { type:"quiz", questions:[ { q:"What do direct shippers pay compared to broker loads?", opts:["Less than brokers","About the same","20-30% more","Twice as much"], ans:2, exp:"Direct shipper relationships typically pay 20-30% more because there is no broker taking a margin." },
        { q:"When pitching a direct shipper, your strongest argument is:", opts:["Your truck is new","You have the lowest rates","Reliability and dedicated capacity","You have a CDL"], ans:2, exp:"Shippers care most about reliability. Lead with on-time delivery record and the promise of." },
        { q:"The best place to find direct shippers in your area is:", opts:["Load boards only","Driving by industrial parks and noting company names","Social media ads","Truck stops"], ans:1, exp:"Industrial parks, warehouses, and manufacturing districts near your home base are gold mines for." },
        { q:"How many direct shippers do you need to build a sustainable business?", opts:["50+","20-30","As few as 3-5 consistent ones","At least 100"], ans:2, exp:"Even 3-5 reliable direct shippers giving consistent weekly freight can build a highly profitable." },
      ]}, ]},
    { id:"o9", title:"Truck Maintenance Planning", icon:"🔧", duration:"5 min read", xp:85, content:[
      { type:"intro", text:"Your truck is your business. A breakdown on the road costs you." },
      { type:"steps", title:"Preventive Maintenance Schedule", items:[
        "Every 15,000 miles - Oil and filter change (check spec for synthetic intervals).",  "Every 25,000 miles - Fuel filters, air filters, brake adjustment check.",
        "Every 50,000 miles - Coolant flush, transmission fluid, DPF cleaning.",  "Every 100,000 miles - Clutch inspection, turbo inspection, injector service.",
        "Annually - Full brake inspection, wheel bearing repack, fifth wheel inspection."
      ]}, { type:"steps", title:"Building Your Maintenance Fund", items:[
        "Set aside $0.15-0.20 per mile specifically for maintenance and repairs.",  "On 100,000 miles per year that is $15,000-20,000 - which is about right.",
        "Never touch this fund for personal expenses - it is not income.",  "Keep 3 months of truck payments in a separate emergency reserve.",
        "Build relationships with 2-3 reliable shops in your most common lanes." ]},
      { type:"tip", title:"Big Earl Says", text:"A $50 belt that snaps on I-80 in Wyoming becomes a $3,000 tow, a." },
      { type:"quiz", questions:[ { q:"How much should you set aside per mile for maintenance?", opts:["$0.05-0.10","$0.15-0.20","$0.30-0.40","$0.50+"], ans:1, exp:"Set aside $0.15-0.20 per mile for maintenance. At 100,000 miles/year that is $15,000-20,000 which." },
        { q:"Oil changes on most modern diesel trucks should occur every:", opts:["5,000 miles","10,000 miles","15,000 miles","25,000 miles"], ans:2, exp:"Most modern diesel trucks use synthetic oil with intervals of approximately 15,000 miles. Check." },
        { q:"DPF cleaning is typically needed every:", opts:["15,000 miles","25,000 miles","50,000 miles","100,000 miles"], ans:2, exp:"Diesel Particulate Filter cleaning is typically needed every 50,000 miles to maintain engine." },
        { q:"Your maintenance fund should NEVER be used for:", opts:["Tires","Brake work","Personal expenses","Engine repairs"], ans:2, exp:"The maintenance fund is strictly for the truck. Using it for personal expenses leaves you unable to." },
      ]}, ]},
    { id:"o10", title:"Scaling to a Small Fleet", icon:"🚛", duration:"5 min read", xp:95, content:[
      { type:"intro", text:"Going from 1 truck to 2 trucks is not twice the income - it is." },
      { type:"steps", title:"Signs You Are Ready to Scale", items:[
        "Profitable for at least 12 consecutive months.",  "3 months of operating expenses in reserve.",
        "More freight than your one truck can handle consistently.",  "A trusted driver candidate or a proven hiring process.",
        "Bookkeeping, dispatch, and compliance systems are already working." ]}, { type:"steps", title:"Hiring Your First Driver", items:[
        "MVR check - pull their motor vehicle record before any interview.",  "PSP report - Pre-employment Screening Program shows crash and inspection history.",
        "Drug and alcohol clearinghouse - federal requirement before hiring any CDL driver.",  "Verify CDL and medical certificate directly with the state - not from the driver.",
        "90-day probation with ride-along monitoring before full independence." ]},
      { type:"tip", title:"Big Earl Says", text:"The number one mistake I see is hiring fast because you need." },
      { type:"quiz", questions:[
        { q:"Before scaling to a second truck, you should have at minimum:", opts:["1 month of reserves","3 months of operating expenses in reserve","6 months of profit","A second CDL"], ans:1, exp:"3 months of operating expenses in reserve is the minimum safety net before adding overhead with a." },
        { q:"A PSP report shows a driver's:", opts:["Credit history","Criminal record","Crash and inspection history from FMCSA","Social security number"], ans:2, exp:"The Pre-employment Screening Program report shows crashes and roadside inspection violations on." },
        { q:"The Drug and Alcohol Clearinghouse check is:", opts:["Optional for small carriers","A federal requirement before hiring any CDL driver","Only for hazmat drivers","Only needed every 3 years"], ans:1, exp:"Querying the FMCSA Drug and Alcohol Clearinghouse is a federal requirement before hiring any CDL." },
        { q:"An empty truck is better than a bad driver because:", opts:["It burns less fuel","Your authority and liability follow their actions","It looks better for CSA","Trucks don't need maintenance when parked"], ans:1, exp:"As the carrier, you are liable for what your drivers do under your authority. One bad hire can end." },
      ]}, ]},
    { id:"o11", title:"Taxes and Deductions", icon:"💰", duration:"5 min read", xp:90, content:[
      { type:"intro", text:"Owner-operators who do not understand their taxes overpay by." },
      { type:"steps", title:"Top Tax Deductions for Truckers", items:[
        "Per diem - $69/day for every day away from home. Largest single deduction.",  "Fuel - 100% deductible. Save every receipt.",
        "Truck loan interest and depreciation - fully deductible business expenses.",  "All insurance premiums - truck, cargo, liability, health.",
        "ELD subscription, load board fees, dispatching fees - all deductible.",  "Cell phone business portion - typically 80-90% for full-time truckers.",
        "Repairs and maintenance - all costs directly related to the truck." ]}, { type:"steps", title:"Quarterly Tax Payments", items:[
        "Self-employed pay 15.3% self-employment tax plus income tax.",  "Pay quarterly: April 15, June 15, September 15, January 15.",
        "Underpay quarterly and you face penalties even if you pay in full at year end.",  "Set aside 25-30% of every payment into a dedicated tax account.",
        "Use ATBS or a trucking-specific accountant - they know our deductions." ]},
      { type:"tip", title:"Big Earl Says", text:"The per diem alone saves you $5,000-8,000 in taxes every year.." },
      { type:"quiz", questions:[ { q:"The per diem deduction for truckers is approximately:", opts:["$35/day","$50/day","$69/day","$100/day"], ans:2, exp:"The IRS per diem rate for transportation workers is $69 per day for days away from home - one of." },
        { q:"Self-employment tax for owner-operators is:", opts:["7.65%","10%","15.3%","20%"], ans:2, exp:"Self-employed individuals pay 15.3% self-employment tax (Social Security + Medicare) because there." },
        { q:"Quarterly estimated taxes are due:", opts:["Jan, Mar, Jun, Sep","Apr, Jun, Sep, Jan","Monthly","Only at year end"], ans:1, exp:"Quarterly payments are due April 15, June 15, September 15, and January 15. Missing them results in." },
        { q:"What percentage of gross revenue should owner-operators set aside for taxes?", opts:["10-15%","20-25%","25-30%","35-40%"], ans:2, exp:"Set aside 25-30% of every payment received. This covers self-employment tax plus federal and state." },
      ]}, ]},
    { id:"o12", title:"Building Your Brand and Reputation", icon:"⭐", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"Your reputation is your business. Shippers choose carriers based." },
      { type:"steps", title:"Your CSA Score", items:[
        "CSA scores every carrier publicly at safer.fmcsa.dot.gov.",  "7 categories scored: Unsafe Driving, HOS, Driver Fitness, Substances, Maintenance, Hazmat, Crash.",
        "High scores trigger FMCSA interventions and loss of shipper contracts.",  "Low scores qualify you for safety bonuses and premium shipper lanes.",
        "Check your score monthly - know where you stand before a shipper checks you." ]},
      { type:"steps", title:"Building a Professional Brand", items:[
        "Keep equipment clean and lettered - your truck is a moving billboard.",  "Respond to all communications within 2 hours during business hours.",
        "Call before you are late - shippers hear from you first, not last.",  "Get verified on DAT and Truckstop.com - verification builds instant credibility.",
        "Ask satisfied shippers for written references - one good reference opens 10 doors."
      ]},
      { type:"tip", title:"Big Earl Says", text:"I built 28 years of reputation one delivery at a time. Every." },
      { type:"quiz", questions:[ { q:"Your CSA score is publicly available at:", opts:["truckscore.com","safer.fmcsa.dot.gov","cdl.gov","fmcsa.dot.gov/register"], ans:1, exp:"Check your score at safer.fmcsa.dot.gov. Shippers and brokers check this before awarding contracts.." },
        { q:"A high CSA score means:", opts:["Excellent safety record","More premium loads offered","Risk of FMCSA interventions and lost contracts","Lower insurance rates"], ans:2, exp:"Higher CSA scores (worse performance) trigger FMCSA compliance reviews, investigations, and can." },
        { q:"How many CSA categories are tracked by FMCSA?", opts:["3","5","7","10"], ans:2, exp:"Seven BASICS are tracked: Unsafe Driving, HOS Compliance, Driver Fitness, Controlled Substances,." },
        { q:"The most effective way to build shipper trust is:", opts:["Lowest rates in the market","Consistent on-time delivery and proactive communication","Newest equipment","Most loads per week"], ans:1, exp:"Reliability and communication build lasting shipper relationships. Shippers will pay more for a." },
      ]}, ]},
    { id:"o13", title:"Factoring Companies", icon:"🏦", duration:"4 min read", xp:80, content:[
      { type:"intro", text:"Cash flow kills more owner-operators than bad rates do. You haul." },
      { type:"steps", title:"How Factoring Works", items:[
        "You haul a load and send your invoice to the factoring company instead of the broker.",  "The factor pays you 90-97% of the invoice amount within 24-48 hours.",
        "The factor then collects the full amount from the broker or shipper.",  "The factor keeps 2-5% as their fee for advancing the cash.",
        "Non-recourse factoring: factor absorbs the loss if broker does not pay.",  "Recourse factoring: you owe the money back if broker does not pay - cheaper but riskier."
      ]}, { type:"steps", title:"True Cost of Factoring", items:[
        "At 3% factoring rate on $10,000 per week in revenue - you pay $300 per week.",  "That is $15,600 per year in factoring fees at that volume.",
        "Compare that to the cost of not having cash for fuel, payments, and insurance.",  "Most new operators need factoring for the first 1-2 years until they build cash reserves.",
        "Once you have 60-90 days of operating expenses in reserve - consider stopping factoring."
      ]}, { type:"steps", title:"Choosing a Factoring Company", items:[
        "Look for: transparent fees, no long-term contracts, no hidden charges.",  "Check reviews on trucking forums and Google - bad factors are well documented.",
        "Top options: RTS Financial, OTR Capital, Triumph Business Capital, TBS Factoring.",  "Avoid: factors with 12+ month contracts, high termination fees, or recourse-only options.",
        "Ask specifically: what is the reserve holdback? When is it released?" ]},
      { type:"tip", title:"Big Earl Says", text:"Factoring is not free money and it is not a long-term business." },
      { type:"quiz", questions:[ { q:"What percentage of an invoice does a factoring company typically advance?", opts:["50-60%","70-80%","90-97%","100%"], ans:2, exp:"Most factoring companies advance 90-97% of the invoice immediately, keeping 2-5% as their fee for." },
        { q:"Non-recourse factoring means:", opts:["You pay the money back if the broker does not pay","The factor absorbs the loss if the broker does not pay","You receive 100% of the invoice","There are no fees"], ans:1, exp:"Non-recourse factoring protects you from broker non-payment. The factoring company absorbs the." },
        { q:"When should an owner-operator consider stopping factoring?", opts:["Never - always use factoring","After the first load","Once you have 60-90 days of operating expenses in reserve","After 5 years in business"], ans:2, exp:"Once you have enough cash reserves to cover 60-90 days of expenses, you no longer need factoring to." },
        { q:"The main problem factoring solves for owner-operators is:", opts:["High fuel costs","Cash flow gaps between hauling loads and receiving payment","Finding loads","Insurance costs"], ans:1, exp:"The primary value of factoring is solving the cash flow problem. Brokers often pay in 30-45 days." },
      ]}, ]},
    { id:"o14", title:"Lease Purchase Agreements", icon:"⚠️", duration:"5 min read", xp:90, content:[
      { type:"intro", text:"Lease purchase agreements have ended more trucking careers than." },
      { type:"steps", title:"How Lease Purchase Works", items:[
        "Carrier leases you a truck and deducts weekly payments from your settlements.",  "At end of the lease term (usually 2-4 years) you own the truck - if all conditions are met.",
        "Payments typically include: truck payment, insurance, maintenance fund, and escrow.",  "You are responsible for all repairs and maintenance costs throughout the lease.",
        "If you leave the lease early, you typically owe a large termination fee." ]}, { type:"steps", title:"Common Lease Purchase Traps", items:[
        "Balloon payment: large final payment due at end of lease that many drivers cannot afford.",  "Inflated truck price: truck priced well above market value - you overpay the entire lease.",
        "Forced dispatch: must haul carrier loads only - no freedom to find better-paying freight.",  "Maintenance escrow: deducted weekly but not always used for your truck.",
        "High cost of insurance through carrier - often more expensive than finding your own.",  "Equipment age: leased trucks are often old, high-mileage, and breakdown-prone."
      ]}, { type:"steps", title:"Questions to Ask Before Signing", items:[
        "What is the total amount I will pay over the life of the lease?",  "What is the buyout price at the end - is there a balloon payment?",
        "Am I required to haul only for this carrier?",  "Who controls the maintenance fund and how is it used?",
        "What happens if I want to exit the lease early?",  "Can I have an independent attorney review this contract before signing?"
      ]},
      { type:"tip", title:"Big Earl Says", text:"I have watched good drivers sign lease purchases and end up." },
      { type:"quiz", questions:[
        { q:"A balloon payment in a lease purchase is:", opts:["A bonus payment for good performance","A large final payment due at end of lease","A type of fuel surcharge","An insurance premium"], ans:1, exp:"A balloon payment is a large lump-sum payment due at the end of a lease term. Many drivers cannot." },
        { q:"The biggest financial risk in a lease purchase is:", opts:["Low fuel costs","Paying an inflated truck price well above market value","Too many loads","Low insurance rates"], ans:1, exp:"Carriers often price lease purchase trucks well above market value, meaning drivers overpay for the." },
        { q:"Before signing a lease purchase agreement you should:", opts:["Sign quickly before the offer expires","Have an independent attorney review the contract","Trust the carrier's explanation completely","Only read the first page"], ans:1, exp:"Always have an independent attorney - not one recommended by the carrier - review any lease." },
        { q:"Forced dispatch in a lease purchase means:", opts:["You can choose any loads you want","You must haul only for that carrier at their rates","You get priority on the best loads","Dispatch helps you find loads"], ans:1, exp:"Forced dispatch requires you to haul only for the carrier at rates they set. This eliminates your." },
      ]}, ]}, ], };

// ─── 50+ CDL QUESTIONS ────────────────────────────────────────────────────────
const CDL_Q = {
  general:[
    { q:"What is the maximum legal weight for most interstate highways?", opts:["60,000 lbs","70,000 lbs","80,000 lbs","90,000 lbs"], ans:2, exp:"The federal maximum gross vehicle weight on interstate highways is 80,000 lbs..", cat:"general" },
    { q:"What does GVWR stand for?", opts:["Gross Vehicle Weight Rating","Gross Vehicle Weight Requirement","General Vehicle Weight Restriction","Gross Volume Weight Ratio"], ans:0, exp:"GVWR is the Gross Vehicle Weight Rating - the maximum weight the vehicle is designed.", cat:"general" },
    { q:"When must you stop at a railroad crossing?", opts:["Only if the lights are flashing","If you are hauling hazmat or transporting passengers","Only if a train is visible","Always stop at all crossings"], ans:1, exp:"CMV drivers must always stop before railroad crossings if they are transporting.", cat:"general" },
    { q:"How far ahead should you look on a highway?", opts:["5-8 seconds","10-12 seconds","12-15 seconds","20-25 seconds"], ans:2, exp:"The FMCSA recommends looking 12-15 seconds ahead on highways - approximately a.", cat:"general" },
    { q:"What is the minimum following distance at highway speed?", opts:["3 seconds","5 seconds","7 seconds","9 seconds"], ans:2, exp:"Minimum 7 seconds of following distance at highway speed. Add one second for every.", cat:"general" },
    { q:"When should hazard lights be used while driving?", opts:["In rain or fog","When driving slowly","When legally parked and creating a hazard","At any time the driver feels unsafe"], ans:2, exp:"Hazard lights should only be used when the vehicle is legally stopped and creating a.", cat:"general" },
    { q:"What action is prohibited under federal law while operating a CMV?", opts:["Eating while driving","Using a hand-held mobile phone","Listening to the radio","Drinking coffee"], ans:1, exp:"Federal law (49 CFR 392.82) prohibits CMV drivers from using hand-held mobile.", cat:"general" },
    { q:"What is the correct way to handle a tire blowout?", opts:["Brake hard immediately","Grip the wheel, accelerate slightly to stabilize, then decelerate gradually","Pull over immediately by braking hard","Turn into the blowout direction"], ans:1, exp:"During a blowout, maintain or slightly increase throttle to stabilize the vehicle,.", cat:"general" },
    { q:"What does a yellow diamond-shaped sign indicate?", opts:["Construction zone","Warning or advisory information","Regulatory requirement","Service area ahead"], ans:1, exp:"Yellow diamond-shaped signs are warning signs that alert drivers to potential.", cat:"general" },
    { q:"What is the correct stopping procedure at a stop sign?", opts:["Slow and proceed if clear","Stop completely at the stop line, check all directions, then proceed","Stop only if other traffic is present","Slow to 5 mph and yield"], ans:1, exp:"At a stop sign you must make a complete stop at the stop line or before the.", cat:"general" },
    { q:"When must you use a seatbelt in a CMV?", opts:["Only on highways","Only when carrying passengers","At all times when operating the vehicle","Only when required by employer policy"], ans:2, exp:"Federal regulations require CMV operators to wear seatbelts at all times when.", cat:"general" },
    { q:"How should you manage speed on a steep downgrade?", opts:["Use service brakes continuously","Coast in neutral to save fuel","Select proper gear before descent and use engine braking","Increase speed then brake at the bottom"], ans:2, exp:"Always select the proper lower gear before beginning a descent and use engine.", cat:"general" }, ,
    { q:"What is the legal BAC limit for CDL drivers operating a commercial vehicle?", opts:[".08",".06",".04",".02"], ans:2, exp:"CDL drivers are held to a stricter .04 BAC limit, half the .08 standard for regular." },
    { q:"Refusing a DOT drug or alcohol test is treated as:", opts:["A warning","A minor infraction","A positive test result","An error"], ans:2, exp:"Refusing a DOT-required test is treated the same as testing positive - immediate." }], airbrakes:[
    { q:"What is the normal operating pressure range for air brakes?", opts:["50-75 psi","100-125 psi","150-175 psi","200-225 psi"], ans:1, exp:"Normal operating air pressure for truck air brakes is 100-125 psi. The governor cuts.", cat:"airbrakes" },
    { q:"At what pressure does the low air warning device activate?", opts:["90 psi","75 psi","60 psi","45 psi"], ans:2, exp:"The low air pressure warning device must activate at 60 psi or higher. At this point.", cat:"airbrakes" },
    { q:"What happens to spring brakes when air pressure drops below 20-45 psi?", opts:["Nothing, they release","They apply automatically","They release completely","Air brakes fail silently"], ans:1, exp:"Spring brakes are designed to apply automatically when air pressure drops to 20-45.", cat:"airbrakes" },
    { q:"What is brake fade?", opts:["Gradual brake adjustment over time","Loss of braking effectiveness due to heat buildup","Air pressure equalizing between chambers","Normal wear on brake linings"], ans:1, exp:"Brake fade is the loss of braking effectiveness caused by excessive heat buildup in.", cat:"airbrakes" },
    { q:"How do you perform a static air leak test?", opts:["Apply brakes and check gauge drops","Build to normal pressure, shut off engine, check drop rate","Open drain valves and check flow","Apply maximum brake force and hold for 30 seconds"], ans:1, exp:"For a static air leak test: build pressure to governor cutout, shut off engine, wait.", cat:"airbrakes" },
    { q:"What is the purpose of the air dryer on an air brake system?", opts:["Increases air pressure","Removes moisture and contaminants from compressed air","Cools the air compressor","Regulates brake application force"], ans:1, exp:"The air dryer removes moisture and oil from the compressed air before it enters the.", cat:"airbrakes" },
    { q:"What does the emergency (red) glad hand connect to?", opts:["Service brake circuit","Emergency/supply circuit","Trailer ABS system","Parking brake release"], ans:1, exp:"The red glad hand connects to the emergency supply line. It provides air to charge.", cat:"airbrakes" },
    { q:"How do you check if the trailer brakes are connected and working?", opts:["Drive forward slowly and brake","Pull forward slightly against locked trailer brakes","Check the air gauge only","Listen for air escaping at the connection"], ans:1, exp:"After connecting the trailer, pump up air pressure, release the tractor parking.", cat:"airbrakes" },
    { q:"What is required before driving after the air pressure warning light comes on?", opts:["Drive slowly to a truck stop","Find a safe place to stop immediately","Call dispatch first","Drive until pressure builds back up"], ans:1, exp:"When the low air pressure warning activates at 60 psi you must find a safe place to stop.", cat:"airbrakes" },
    { q:"How often should air brake systems be inspected under FMCSA?", opts:["Annually only","As part of every pre-trip inspection","Every 30,000 miles","Only when problems arise"], ans:1, exp:"Air brake system components must be inspected as part of every pre-trip inspection..", cat:"airbrakes" },
  ], combination:[
    { q:"What is the maximum overall length for a combination vehicle on most interstates?", opts:["53 feet","65 feet","75 feet","80 feet"], ans:2, exp:"Most states allow combination vehicles up to 75 feet in total length on interstate.", cat:"combination" },
    { q:"What causes trailer sway?", opts:["Driving too slowly","Weight distributed too far forward","Improper loading with too much weight at rear, or crosswinds","Using cruise control"], ans:2, exp:"Trailer sway is primarily caused by loading too much weight at the rear of the.", cat:"combination" },
    { q:"How do you correct trailer sway when it begins?", opts:["Brake hard to slow down","Accelerate to straighten the trailer","Avoid braking, ease off throttle, steer in the direction of sway","Turn sharply in the opposite direction"], ans:2, exp:"When trailer sway begins, avoid braking (it makes sway worse), ease off the throttle, and.", cat:"combination" },
    { q:"What is the maximum kingpin setback from the front of the trailer?", opts:["34 inches","36 inches","40 inches","46 inches"], ans:0, exp:"The standard kingpin setback is 34 inches from the front face of the trailer. This.", cat:"combination" },
    { q:"After coupling, how do you verify the fifth wheel is properly locked?", opts:["Check visually that the pin is closed","Pull forward hard against the brakes","Perform a tug test by pulling against locked trailer brakes","All of the above"], ans:3, exp:"Proper fifth wheel coupling verification requires: visual inspection to confirm the.", cat:"combination" },
    { q:"What is rearward amplification in combination vehicles?", opts:["Echo from the trailer body","The tendency for rear trailer wheels to move more than front wheels during evasive maneuvers","Amplified braking force at the rear","Increased turning radius"], ans:1, exp:"Rearward amplification is the tendency for the rear of a trailer to whip.", cat:"combination" },
    { q:"What does sliding the tandems forward do to axle weights?", opts:["Reduces drive axle weight, increases trailer axle weight","Reduces trailer axle weight, increases drive axle weight","Has no effect on individual axle weights","Reduces steer axle weight"], ans:0, exp:"Sliding the trailer tandems forward shifts weight toward the rear of the tractor,.", cat:"combination" },
    { q:"When should you downshift while pulling a heavy load on a downgrade?", opts:["At the bottom of the grade","Halfway down","Before you begin the descent","When speed increases beyond safe level"], ans:2, exp:"Always select the correct lower gear before starting a descent. If you wait until.", cat:"combination" },
    { q:"What is the correct sequence for uncoupling a semi-trailer?", opts:["Remove glad hands, lower landing gear, release fifth wheel","Lower landing gear, disconnect glad hands, release fifth wheel","Chock trailer wheels, lower landing gear, disconnect air lines, release fifth wheel","Release fifth wheel, then lower landing gear"], ans:2, exp:"Correct uncoupling sequence: apply trailer brakes, chock trailer wheels, lower.", cat:"combination" },
  ], roadsigns:[
    { q:"What shape and color is a warning sign?", opts:["Red octagon","Yellow diamond","White rectangle","Orange diamond"], ans:1, exp:"Warning signs are yellow diamond-shaped. They alert drivers to potential hazards.", cat:"roadsigns" },
    { q:"What does a pennant-shaped sign indicate?", opts:["Curve ahead","Begin passing zone","No passing zone","End of construction"], ans:2, exp:"A pennant-shaped (triangular) sign is used exclusively to mark the beginning of a No.", cat:"roadsigns" },
    { q:"A flashing red light at an intersection means:", opts:["Slow and proceed","Yield to cross traffic","Stop completely then proceed when safe","Road closed ahead"], ans:2, exp:"A flashing red signal is treated the same as a stop sign. Come to a complete stop,.", cat:"roadsigns" },
    { q:"What does an orange sign indicate?", opts:["Regulatory requirement","Service area","Construction or work zone","Recreational area"], ans:2, exp:"Orange signs indicate construction, maintenance, or utility work zones. Speed limits.", cat:"roadsigns" },
    { q:"What does a green sign typically indicate?", opts:["Warning of hazard ahead","Directional and distance information","Regulatory requirement","Service facilities"], ans:1, exp:"Green signs provide directional guidance and distance information including highway.", cat:"roadsigns" },
    { q:"What does a white rectangular sign indicate?", opts:["Advisory speed","Warning of hazard","Regulatory requirement (must obey)","General information"], ans:2, exp:"White rectangular signs are regulatory signs that indicate laws and rules that must.", cat:"roadsigns" },
    { q:"What does a blue sign along a highway indicate?", opts:["Rest areas only","Emergency services only","Motorist services like food, fuel, and lodging","State information centers"], ans:2, exp:"Blue signs indicate motorist services including food, fuel, lodging, hospital, and.", cat:"roadsigns" },
    { q:"What does a sign with a red circle and slash over a symbol mean?", opts:["Caution required","The indicated action is prohibited","Advisory only","Historical marker"], ans:1, exp:"A red circle with a diagonal slash over a symbol is an international prohibition.", cat:"roadsigns" },
    { q:"What does a yield sign require?", opts:["Full stop always","Slow to 15 mph","Slow down and stop if necessary to let cross traffic pass","Match speed of oncoming traffic"], ans:2, exp:"A yield sign requires you to slow down and be prepared to stop if necessary to allow.", cat:"roadsigns" },
    { q:"What color and shape is a railroad crossing advance warning sign?", opts:["Yellow circle","Orange diamond","Yellow diamond with X","White with railroad symbol"], ans:0, exp:"The advance railroad crossing warning sign is yellow, round, with a black X and RR.", cat:"roadsigns" },
    { q:"What does a double yellow center line mean?", opts:["Passing allowed in both directions","No passing in either direction","Passing allowed only when dashed","Two-way traffic begins"], ans:1, exp:"Double solid yellow center lines prohibit passing in both directions. Neither driver.", cat:"roadsigns" },
  ], hazmat:[
    { q:"What does a placard on a vehicle indicate?", opts:["Oversized load","Hazardous materials being transported","Commercial vehicle with special permit","Temperature-controlled cargo"], ans:1, exp:"Placards on vehicles indicate that hazardous materials are being transported. They.", cat:"hazmat" },
    { q:"Who is responsible for providing correct hazmat shipping papers?", opts:["The carrier","The driver","The shipper","FMCSA"], ans:2, exp:"The shipper is responsible for providing accurate shipping papers (manifest) and.", cat:"hazmat" },
    { q:"Where must hazmat shipping papers be kept while driving?", opts:["In the glove box","In a pouch on the door or in reach of the driver","In the trailer with the cargo","Faxed to dispatch"], ans:1, exp:"Hazmat shipping papers must be within the driver reach while driving or in a door.", cat:"hazmat" },
    { q:"What is the minimum distance from a bridge a placarded vehicle must park?", opts:["100 feet","300 feet","500 feet","1,000 feet"], ans:1, exp:"Placarded hazmat vehicles must not be parked within 300 feet of bridges, tunnels, or.", cat:"hazmat" },
  ], doubles:[
    { q:"When pulling double trailers, the lighter trailer should be:", opts:["In front closest to tractor","At the rear","It does not matter","Heaviest first always"], ans:1, exp:"The heavier trailer should always be directly behind the tractor. The lighter." },
    { q:"What is the maximum length for a set of doubles in most states?", opts:["65 feet","75 feet","95 feet","105 feet"], ans:1, exp:"Most states allow doubles up to 75 feet total length. Some western states allow." },
    { q:"When coupling doubles, the converter dolly is placed:", opts:["Behind the second trailer","Between the two trailers","In front of the first trailer","Behind the tractor"], ans:1, exp:"The converter dolly connects the two trailers together. It is placed between the." },
    { q:"The crack-the-whip effect is most dangerous on:", opts:["The tractor","The first trailer","The rear trailer","The converter dolly"], ans:2, exp:"Rearward amplification means the rear trailer swings much more than the front during." },
    { q:"Before moving a set of doubles, you must:", opts:["Only check the first trailer connection","Test each trailer coupling separately with a pull test","Check only the converter dolly","No special checks needed"], ans:1, exp:"Each coupling point must be individually checked with a tug test. A failure at any." },
    { q:"When inspecting doubles, the pintle hook must be:", opts:["Slightly open for flexibility","Fully latched and locked","Greased and partially open","Secured with a safety chain only"], ans:1, exp:"The pintle hook must be fully latched and locked. Check that the locking mechanism." },
    { q:"Triples are generally not permitted:", opts:["On interstate highways","East of the Mississippi River","In states with mountainous terrain","During nighttime hours"], ans:1, exp:"Triple trailer combinations are generally restricted to western states and are not." },
    { q:"The most important thing when turning with doubles is:", opts:["Speed up through the turn","Make wider turns than normal","Make sharper turns than normal","Brake hard through the turn"], ans:1, exp:"Doubles require wider turns due to the length of the combination. The rear trailer." },
    { q:"Emergency braking with doubles requires:", opts:["Hard brake application","Controlled braking to avoid jackknife","Releasing brakes completely","Using only the trailer brakes"], ans:1, exp:"Controlled braking is critical with doubles. Hard braking can cause jackknife of." },
    { q:"What should you do if a trailer becomes uncoupled while driving?", opts:["Accelerate to pull it back","Brake hard immediately","Brake gradually and pull off road safely","Ignore it and call dispatch"], ans:2, exp:"Brake gradually and safely pull off the road. Hard braking with an uncoupled trailer." },
  ], tanker:[
    { q:"Liquid surge in a tanker occurs when:", opts:["The tank is completely full","The tank is completely empty","The tank is partially filled","Only in heated tanks"], ans:2, exp:"Liquid surge (surge effect) is most dangerous in partially filled tanks. The liquid." },
    { q:"A baffled tanker has:", opts:["No internal walls","Bulkheads that completely divide the tank","Bulkheads with holes to allow liquid flow","Extra thick walls"], ans:2, exp:"Baffled tanks have bulkheads with holes or openings that allow liquid to flow." },
    { q:"The most dangerous handling condition in a tanker is:", opts:["Fully loaded tank","Empty tank","Partially filled unbaffled tank","Tank with baffles"], ans:2, exp:"A partially filled unbaffled tank has the worst liquid surge. The liquid moves." },
    { q:"When loading a tanker, you should never fill it:", opts:["More than 25% full","More than 50% full","More than 80% full","100% because expansion space is needed"], ans:3, exp:"Liquid expands with heat. Tanks should never be completely filled because the liquid." },
    { q:"Outage (ullage) in a tanker refers to:", opts:["The amount of liquid in the tank","The empty space left for expansion","The weight of the liquid","The pressure inside the tank"], ans:1, exp:"Outage or ullage is the empty space left at the top of the tank to allow for liquid." },
    { q:"Before loading a tanker with a new product you must:", opts:["Just proceed normally","Check that the tank is clean and residue-free","Add water first","Increase pressure in the tank"], ans:1, exp:"Always verify the tank is clean and free of residue from previous loads. Mixing." },
    { q:"A tanker rollover is most likely to occur when:", opts:["Driving straight on flat roads","Braking on a straight highway","Taking curves or turns too fast","Driving uphill"], ans:2, exp:"Tankers have a high center of gravity. Taking curves or turns too fast is the." },
    { q:"Retest markings on a tanker indicate:", opts:["The tank's weight limit","When the tank must be inspected again","The type of cargo allowed","The fill level"], ans:1, exp:"Retest markings show the date when the tank was last tested and when it must be." },
    { q:"When parking a tanker loaded with hazmat you must:", opts:["Park anywhere convenient","Never park within 300 feet of open fire","Park only at truck stops","Always leave engine running"], ans:1, exp:"Never park a hazmat tanker within 300 feet of an open flame or fire. Follow all." },
    { q:"The main difference between a smooth bore and baffled tank is:", opts:["Smooth bore holds more liquid","Baffles reduce liquid surge","Smooth bore is safer","Baffled tanks are lighter"], ans:1, exp:"Baffled tanks have internal walls with openings that slow liquid movement and reduce." },
  ], passenger:[
    { q:"When driving a bus, you should check your mirrors:", opts:["Only when changing lanes","Every 5-8 seconds","Only at stops","Once per hour"], ans:1, exp:"Bus drivers should scan mirrors every 5-8 seconds. With passengers on board,." },
    { q:"You must evacuate a bus when:", opts:["A passenger requests it","There is a fire or danger of fire","You are running late","Traffic is heavy"], ans:1, exp:"Mandatory evacuation is required when there is a fire or imminent danger of fire,." },
    { q:"When stopped at a railroad crossing with passengers, you must:", opts:["Cross quickly","Stop, open the door, listen and look, then cross","Honk and proceed","Wait for a signal from the conductor"], ans:1, exp:"Buses carrying passengers must stop at all railroad crossings, open the door and." },
    { q:"Standees on a bus may only stand:", opts:["Anywhere they choose","Behind the standee line","In the stairwell","Next to the driver"], ans:1, exp:"Standees must remain behind the standee line, which is typically marked behind the." },
    { q:"Carrying drunk or disruptive passengers:", opts:["Is always permitted","Is never permitted","Is permitted if they stay seated","Depends on the route"], ans:1, exp:"You must refuse to transport or remove passengers who are drunk, disruptive, or a." },
    { q:"Before driving a bus you must inspect:", opts:["Only the engine","Emergency exits, fire extinguisher, and first aid kit","Only the tires","Just the mirrors"], ans:1, exp:"Pre-trip inspection of a bus must include checking all emergency exits function." },
    { q:"A bus driver must have a CDL with passenger endorsement to drive a vehicle designed.", opts:["8 or more passengers","16 or more passengers including driver","10 or more passengers","25 or more passengers"], ans:1, exp:"A CDL with passenger (P) endorsement is required for vehicles designed to carry 16." },
    { q:"When loading passengers, you should:", opts:["Load as fast as possible","Allow all passengers to be seated before moving","Move slowly while they find seats","Close doors immediately after last passenger boards"], ans:1, exp:"Never move until all passengers are seated and secured. Injuries from falls during." },
    { q:"Approaching a bus stop you should:", opts:["Stop quickly to save time","Check mirrors, signal early, and approach gradually","Honk to alert waiting passengers","Use hazard lights only"], ans:1, exp:"Signal early, check mirrors frequently, and slow gradually when approaching a bus." },
    { q:"School buses must stop at railroad crossings:", opts:["Only when lights are flashing","Only if carrying students","Always, even when empty","Only on designated routes"], ans:2, exp:"School buses must stop at all railroad crossings regardless of whether students are." },
  ], pretriptest:[
    { q:"During the pre-trip inspection, engine oil level must be:", opts:["At maximum only","Between minimum and maximum marks","Below minimum is acceptable","Only checked monthly"], ans:1, exp:"Oil must be between the minimum and maximum marks on the dipstick. Running below." },
    { q:"During the air brake check, the low pressure warning must activate:", opts:["Above 100 PSI","Below 60 PSI","At exactly 90 PSI","At 120 PSI"], ans:1, exp:"The low pressure warning device must activate before pressure drops below 60 PSI.." },
    { q:"The tug test during coupling is performed by:", opts:["Pushing forward against the trailer","Pulling forward against locked trailer brakes","Backing hard into the trailer","Applying all trailer brakes manually"], ans:1, exp:"After coupling, pull the tractor forward against the locked trailer brakes. If the." },
    { q:"Slack adjusters should not move more than how far when pulled by hand?", opts:["Half an inch","1 inch","2 inches","3 inches"], ans:1, exp:"Properly adjusted slack adjusters should not move more than 1 inch when pulled hard." },
    { q:"During the pre-trip, you check the fifth wheel by:", opts:["Just looking at it","Visually checking jaws are closed AND doing a tug test","Only the tug test","Only visual check is needed"], ans:1, exp:"Both steps are required - visually confirm the locking jaws are fully closed around." },
    { q:"Tire tread depth on steer tires must be at least:", opts:["2/32 inch","4/32 inch","6/32 inch","8/32 inch"], ans:1, exp:"Steer tires require a minimum of 4/32 inch tread depth. Drive and trailer tires." },
    { q:"During the engine compartment check, belts should have no more than:", opts:["1/4 inch deflection","3/4 inch deflection","1 inch deflection","2 inches deflection"], ans:1, exp:"Accessory belts should have no more than 3/4 inch of deflection when pressed. Loose." },
    { q:"The steering wheel free play on a large truck should not exceed:", opts:["5 degrees","10 degrees","15 degrees","20 degrees"], ans:1, exp:"Steering wheel free play should not exceed 10 degrees (about 2 inches of movement)." },
    { q:"Lights must be checked during pre-trip by:", opts:["Only at nighttime","Turning them on and walking around the vehicle","Only checking the dashboard indicators","Only the headlights matter"], ans:1, exp:"Turn on all lights and physically walk around the vehicle to verify each light is." },
    { q:"During the pre-trip, glad hands should be checked for:", opts:["Color only","Secure connection and no air leaks","Just that they are connected","Only the emergency line matters"], ans:1, exp:"Check both glad hands are securely connected with no air leaks. The red emergency." },
  ], cargo:[
    { q:"The minimum number of tie-downs for cargo up to 10 feet long is:", opts:["1","2","3","4"], ans:1, exp:"A minimum of 2 tie-downs is required for any cargo up to 10 feet in length." },
    { q:"Cargo must be re-examined within how many miles after beginning a trip?", opts:["25 miles","50 miles","100 miles","150 miles"], ans:3, exp:"Cargo must be checked within the first 50 miles and then every 150 miles or 3 hours." },
    { q:"The aggregate working load limit of all tie-downs must be at least:", opts:["One quarter of cargo weight","One third of cargo weight","One half of cargo weight","Equal to cargo weight"], ans:2, exp:"The total WLL of all securement devices must equal at least 50% of the cargo weight.." },
    { q:"Edge protection for tie-downs is required when:", opts:["Always required","When straps contact sharp edges that could damage them","Only for steel cargo","Never required"], ans:1, exp:"Edge protection must be used wherever tie-down straps or chains contact sharp edges." },
    { q:"When securing logs, the minimum requirement is:", opts:["2 tie-downs only","Wrappers or stakes AND binder chains","A tarp covering","Safety flags on the ends"], ans:1, exp:"Logs require specific securement including front stakes or wrapper chains plus." },
    { q:"For flatbed loads, friction mats:", opts:["Are never allowed","Can be used to supplement tie-downs","Replace the need for tie-downs","Are required on all loads"], ans:1, exp:"Friction mats increase the friction between cargo and the deck, reducing the number." },
    { q:"Oversized loads generally require:", opts:["No special requirements","Permits, pilot cars, and specific travel times","Only a wide load sign","Just a permit"], ans:1, exp:"Oversized loads typically require special permits, pilot/escort vehicles, specific." },
    { q:"When hauling a vehicle on a flatbed, it must be secured at:", opts:["2 points minimum","All 4 wheels","The frame only","The bumpers"], ans:1, exp:"Vehicles must be secured at all 4 wheels using wheel straps or chains. The vehicle." },
    { q:"Dunnage bags are used to:", opts:["Protect cargo from rain","Fill void spaces and prevent cargo shifting","Replace tie-downs","Mark oversize loads"], ans:1, exp:"Dunnage bags (air bags) are inflatable bags placed in void spaces between cargo to." },
    { q:"The front end structure or headboard must be rated to withstand:", opts:["25% of cargo weight","50% of cargo weight","75% of cargo weight","100% of cargo weight"], ans:0, exp:"The front end structure or headerboard must be strong enough to withstand a force." },
  ], hosadvanced:[
    { q:"The sleeper berth provision allows splitting rest into:", opts:["Any two periods totaling 10 hours","A period of at least 7 hours in the sleeper plus 2+ hours off duty","Two equal 5 hour periods","Any combination totaling 8 hours"], ans:1, exp:"The sleeper berth split requires at least 7 consecutive hours in the sleeper berth." },
    { q:"The 60-hour/7-day limit applies to:", opts:["All CMV drivers","Only property carriers","Only passenger carriers","Only hazmat carriers"], ans:0, exp:"The 60-hour/7-day rule applies to all commercial motor vehicle drivers who drive for." },
    { q:"Personal conveyance allows a driver to:", opts:["Drive any distance off duty","Move the vehicle for personal use without affecting HOS","Drive during mandatory rest periods","Extend the 14-hour window"], ans:1, exp:"Personal conveyance allows movement of a CMV for personal reasons while off duty -." },
    { q:"The adverse driving conditions exception allows:", opts:["Skipping the 30-minute break","Extending the 11-hour limit by 2 hours","Resetting the 14-hour clock","Driving after 70 hours"], ans:1, exp:"If adverse driving conditions develop that were not foreseeable, drivers may extend." },
    { q:"Under the short-haul exception, a driver is exempt from ELD requirements if:", opts:["They drive under 100 miles","They work within 150 air miles of home terminal and return each day","They only drive locally","They have been driving less than 1 year"], ans:1, exp:"The short-haul exception applies to drivers who operate within 150 air miles of." },
    { q:"On-duty time includes:", opts:["Only driving time","All time at work except rest in sleeper berth","Only loading and unloading","Only time the engine is running"], ans:1, exp:"On-duty time includes all time performing work duties - driving, loading, unloading,." },
    { q:"A driver who falsifies a logbook can face:", opts:["A warning only","Civil penalties up to $16,000 per violation","Loss of CDL for 30 days","A $500 fine only"], ans:1, exp:"Falsifying a logbook is a federal offense with civil penalties up to $16,000 per." },
    { q:"The 34-hour restart requires:", opts:["Any 34 consecutive hours off duty","34 hours including two periods from 1-5 AM","34 hours of sleeper berth time","Two full days off"], ans:1, exp:"A valid 34-hour restart must include two periods from 1:00 AM to 5:00 AM home." },
    { q:"After the 30-minute break, a driver:", opts:["Resets the 14-hour clock","Can drive another 8 hours before needing another break","Resets the 11-hour driving limit","Must take another break within 4 hours"], ans:1, exp:"The 30-minute break only pauses the 8-hour on-duty driving clock. It does not reset." },
    { q:"Which of the following is considered off-duty time?", opts:["Waiting at a shipper dock","Resting in a sleeper berth","Fueling the truck","Performing a pre-trip inspection"], ans:1, exp:"Time spent resting in a sleeper berth is recorded as sleeper berth time, which." },
  ], wellness:[
    { q:"According to FMCSA, what percentage of truck accidents involve a fatigued driver?", opts:["5%","8%","13%","20%"], ans:2, exp:"FMCSA estimates approximately 13% of commercial truck accidents involve driver." },
    { q:"Sleep apnea in truck drivers is a concern because:", opts:["It only affects older drivers","It causes daytime sleepiness and impaired alertness while driving","It is easily detected in a standard physical","It only occurs in overweight drivers"], ans:1, exp:"Sleep apnea causes interrupted sleep and oxygen deprivation, leading to severe." },
    { q:"The most dangerous time for fatigue-related crashes is:", opts:["Mid-morning","Early afternoon","Midnight to 6 AM and mid-afternoon","Rush hour"], ans:2, exp:"Fatigue-related crashes peak between midnight and 6 AM due to the body's circadian." },
    { q:"Which of the following is NOT an effective fatigue countermeasure?", opts:["Power napping 15-20 minutes","Turning up the radio or opening windows","Stopping driving and resting","Getting adequate sleep before driving"], ans:1, exp:"Turning up the radio or opening windows provides only momentary, unreliable." },
    { q:"A DOT physical examination is required every:", opts:["Year","2 years","3 years","5 years"], ans:1, exp:"CDL drivers must maintain a current DOT medical certificate, which is valid for up." },
    { q:"The blood pressure limit to pass a DOT physical is:", opts:["120/80","140/90","160/100","180/110"], ans:1, exp:"Blood pressure must be below 140/90 to receive a 2-year medical certificate. Drivers." },
    { q:"Which substance is tested for in a DOT drug test?", opts:["Alcohol only","Marijuana, cocaine, opioids, amphetamines, and PCP","Prescription medications only","Marijuana only"], ans:1, exp:"DOT drug tests screen for 5 substances: marijuana, cocaine, opioids/opiates,." },
    { q:"Random drug testing in the trucking industry requires testing:", opts:["10% of drivers annually","25% for drugs and 10% for alcohol annually","50% of all drivers","All drivers every year"], ans:1, exp:"FMCSA requires carriers to randomly test at least 50% of drivers for drugs and 10%." },
  ], };

// ─── 20+ SIMULATION SCENARIOS ─────────────────────────────────────────────────
const SIMS = [
  { id:"s1", track:"all", title:"Blown Steer Tire at Speed", icon:"💥", category:"Emergency", difficulty:"Expert",
    scenario:"You are southbound on I-35 at 67 mph with a full load. Without warning your right front steer tire.",
    options:[
      { text:"Grip wheel hard and brake to a stop immediately", outcome:"bad", result:"Wrong Call", detail:"Hard braking during a front blowout causes violent pulling, possible jackknife, and loss of.", lesson:"Never brake hard during a blowout. Grip and stabilize first." },
      { text:"Grip wheel, slight throttle to stabilize, then gradually slow", outcome:"good", result:"Textbook Response", detail:"A short burst of throttle during a blowout counteracts the drag of the flat tire and stabilizes the.", lesson:"Throttle briefly to stabilize, then slow and steer right." },
      { text:"Swerve left away from the flat tire pull", outcome:"bad", result:"Fatal Error", detail:"Swerving left at 67 mph into traffic is catastrophic. The physics of a blowout must be countered,.", lesson:"Steer to the shoulder. Never swerve into traffic." },
    ]},
  { id:"s2", track:"all", title:"Mountain Brake Fade", icon:"⛰️", category:"Emergency", difficulty:"Expert",
    scenario:"Westbound on I-70 descending Eisenhower Tunnel grade - 7% for 6 miles. Mile 3. Your service brakes.",
    options:[
      { text:"Keep applying service brakes harder to slow down", outcome:"bad", result:"Brake Failure Ahead", detail:"Continuing to ride service brakes on a fading system builds more heat. At this grade you have.", lesson:"Once brakes fade, service brakes are no longer your tool. Engine braking only." },
      { text:"Shift to neutral to reduce engine drag", outcome:"bad", result:"Catastrophically Wrong", detail:"Shifting to neutral removes all engine braking and allows the truck to accelerate freely down the.", lesson:"Never shift to neutral on a downgrade. Always use engine braking." },
      { text:"Use the runaway ramp - do not hesitate", outcome:"good", result:"Right Decision", detail:"Runaway truck ramps are designed exactly for this situation. They can stop a 40-ton truck from 60.", lesson:"Use runaway ramps before losing control, not after." },
    ]},
  { id:"s3", track:"all", title:"Ice Bridge at 55 MPH", icon:"🌨️", category:"Emergency", difficulty:"Expert",
    scenario:"It is 29 degrees Fahrenheit on I-80 in Wyoming. You enter a bridge and instantly feel the trailer.",
    options:[
      { text:"Brake hard to reduce speed immediately", outcome:"bad", result:"Jackknife Initiated", detail:"Hard braking on ice locks wheels, removes steering ability, and causes the trailer to continue.", lesson:"Never brake hard on ice. Smooth inputs only." },
      { text:"Ease completely off throttle, steer straight, let friction slow you", outcome:"good", result:"Correct Technique", detail:"On ice, smooth is everything. Releasing throttle gradually reduces speed through engine braking.", lesson:"Ice requires feather-touch inputs. Smooth throttle release, straight steering." },
      { text:"Counter-steer sharply to correct the slide", outcome:"bad", result:"Overcorrection Crash", detail:"Sharp counter-steering on ice at 55 mph with a loaded trailer causes a snap-over reaction. The.", lesson:"On ice, never make sharp steering inputs. Gradually and smoothly." },
    ]},
  { id:"s4", track:"all", title:"Tire Fire in the Trailer", icon:"🔥", category:"Emergency", difficulty:"Intermediate",
    scenario:"You smell burning rubber. Your trailer brake temp light comes on. A car driver beside you on I-40.",
    options:[
      { text:"Drive the 6 miles to the truck stop quickly", outcome:"bad", result:"Fire Risk Escalated", detail:"A dragging brake or tire fire can reach 400+ degrees in minutes. Driving 6 miles means potentially.", lesson:"Never drive to a destination with a potential tire or brake fire. Stop now." },
      { text:"Pull over immediately, inspect, do not open trailer doors", outcome:"good", result:"Correct Protocol", detail:"Pull off at the first safe spot, stay away from the wheel area, call 911 if you see flames. Do NOT.", lesson:"Stop, assess from a distance, call 911 if fire. Never open burning trailer." },
      { text:"Spray water on the tires from your water bottle", outcome:"bad", result:"Wrong Response", detail:"Water on a superheated brake drum can cause a steam explosion or crack the drum. Never put water on.", lesson:"Never put water on overheated brakes. Park and wait for cool-down." },
    ]},
  { id:"s5", track:"all", title:"Weigh Station Overweight", icon:"⚖️", category:"Compliance", difficulty:"Intermediate",
    scenario:"Scales in Arkansas. Red light. Officer says your drive axles are 2,200 lbs over the 34,000 lb.",
    options:[
      { text:"Argue that the shipper sealed it and you cannot be responsible", outcome:"bad", result:"Wrong Approach", detail:"Once you signed the BOL and moved the load, you accepted responsibility. Officers have heard this.", lesson:"You are responsible for your load's weight. Cooperate professionally." },
      { text:"Accept the citation, slide tandems to redistribute, continue legally", outcome:"good", result:"Professional Handling", detail:"Sliding tandems forward shifts weight from drive axles to trailer axles. If this brings you into.", lesson:"Sliding tandems is often the professional fix for axle weight issues." },
      { text:"Pay the fine and drive off without adjusting", outcome:"bad", result:"Legal Exposure Remains", detail:"If you cannot bring the truck into compliance by adjusting axles, you need an overweight permit or.", lesson:"A fine does not make an overweight truck legal. Must achieve compliance to move." },
    ]},
  { id:"s6", track:"all", title:"HOS Close Call", icon:"⏰", category:"Compliance", difficulty:"Intermediate",
    scenario:"You have 1 hour and 10 minutes of drive time remaining. GPS shows 1 hour 45 minutes to your.",
    options:[
      { text:"Push through - it is only 35 minutes over on a deserted road", outcome:"bad", result:"Federal Violation", detail:"Running out of hours is a federal HOS violation regardless of road conditions, time of night, or.", lesson:"No schedule justifies an HOS violation. Your CDL is your livelihood." },
      { text:"Stop at the next legal parking spot, take your 10-hour break", outcome:"good", result:"Correct and Professional", detail:"Finding legal parking and stopping is always the right answer. Call dispatch with your location and.", lesson:"Stop when your hours are up. Every time. No exceptions." },
      { text:"Drive to a truck stop 12 miles away, then stop for the night", outcome:"bad", result:"Still a Violation", detail:"12 miles over your hours is still a violation. The ELD records your location, speed, and duty.", lesson:"Stop when hours are up, not when it is convenient." },
    ]},
  { id:"s7", track:"all", title:"Failed Pre-Trip Discovery", icon:"🔧", category:"Compliance", difficulty:"Beginner",
    scenario:"Pre-trip at 5:30 AM. You find a visible crack in the left front brake chamber. Dispatch needs this.",
    options:[
      { text:"Take dispatch word for it and roll out", outcome:"bad", result:"OOSA Violation", detail:"Knowingly operating a vehicle with a known defect is an Out Of Service violation. If caught in.", lesson:"Never operate with a known defect. Period. No dispatcher authority supersedes safety law." },
      { text:"Document the defect on DVIR, refuse to move, demand repair", outcome:"good", result:"Correct Legal Position", detail:"Complete a Driver Vehicle Inspection Report documenting the defect. You are legally protected when.", lesson:"Document defects on DVIR. You have the legal right and duty to refuse an unsafe truck." },
      { text:"Drive slowly and carefully to the first truck stop", outcome:"bad", result:"Still Operating Defective Equipment", detail:"There is no speed that makes a cracked brake chamber legal to operate. Slow driving does not fix.", lesson:"Defective brakes make the truck OOS. No movement allowed until repaired." },
    ]},
  { id:"s8", track:"owner", title:"Low-Ball Broker Offer", icon:"📉", category:"Business", difficulty:"Intermediate",
    scenario:"Broker offers $1.85/mile on a 1,200-mile load. Your all-in cost is $1.72/mile. You have been parked.",
    options:[
      { text:"Take it - any money is better than sitting", outcome:"neutral", result:"Mistake with Context", detail:"Taking $1.85 when market is $2.15-2.30 trains this broker that you accept low rates. You also lose.", lesson:"Low rates train brokers. Know your market before accepting." },
      { text:"Counter at $2.20/mile citing current DAT market data", outcome:"good", result:"Professional Negotiation", detail:"Countering with market data is standard practice. Most brokers have more room than their first.", lesson:"Always counter with market data. DAT rates give you leverage." },
      { text:"Walk away and call other brokers for the same lane", outcome:"good", result:"Market Discipline", detail:"With market at $2.15-2.30 this broker is low by $360-540. Spending 30 minutes working other brokers.", lesson:"Working multiple brokers for market rate is always worth the time." },
    ]},
  { id:"s9", track:"owner", title:"Broker Claims Non-Payment", icon:"💸", category:"Business", difficulty:"Expert",
    scenario:"A broker owes you $4,200 for a load delivered 45 days ago. They are now unresponsive. You need that.",
    options:[
      { text:"Post a negative online review and move on", outcome:"bad", result:"Wrong First Step", detail:"A negative review without legal action leaves $4,200 on the table. Reviews are fine but they are.", lesson:"Use legal remedies before or alongside public complaints." },
      { text:"Send a formal demand letter and file a complaint with FMCSA", outcome:"good", result:"Right Protocol", detail:"Send a certified demand letter with payment deadline. File a complaint with FMCSA and the Better.", lesson:"Demand letter + FMCSA complaint is the correct escalation path." },
      { text:"Accept partial payment and move on", outcome:"bad", result:"Accepting Theft", detail:"A broker who refuses to pay owes you the full amount. Accepting partial payment may waive your.", lesson:"Never accept partial without a written settlement agreement." },
    ]},
  { id:"s10", track:"owner", title:"Truck Breakdown Cross-Country", icon:"🛠️", category:"Business", difficulty:"Intermediate",
    scenario:"Your turbo blew 350 miles from delivery. Shop estimate is $2,800 and 3 days. Broker threatens a.",
    options:[
      { text:"Pay the repair, pay the backcharge, and absorb the loss", outcome:"bad", result:"Financial Damage", detail:"Accepting the backcharge without review costs you $5,800 total on a load you likely netted.", lesson:"Mechanical breakdown is force majeure. Review your contract before accepting claims." },
      { text:"Review contract terms, respond in writing citing force majeure", outcome:"good", result:"Legally Sound", detail:"Most motor carrier contracts include force majeure clauses covering mechanical breakdowns. Respond.", lesson:"Respond to claims in writing. Force majeure clauses protect you from mechanical backcharges." },
      { text:"Find a carrier to transload and complete the delivery", outcome:"good", result:"Above and Beyond", detail:"Arranging transload delivery shows professionalism and often results in the broker waiving claims.", lesson:"Transloading is the professional solution that preserves relationships and protects your record." },
    ]},
  { id:"s11", track:"all", title:"Four-Wheeler Cut-Off", icon:"🚗", category:"Road Skill", difficulty:"Beginner",
    scenario:"On the interstate at 65 mph a sedan merges directly in front of you with less than 3 seconds of.",
    options:[
      { text:"Brake hard and lean on your horn", outcome:"neutral", result:"Survivable but Dangerous", detail:"Hard braking with a full load risks rear-end collision from following traffic and can cause trailer.", lesson:"Hard braking is a last resort. Space management prevents this situation." },
      { text:"Move to available adjacent lane if clear, ease off throttle", outcome:"good", result:"Space Management", detail:"If the adjacent lane is clear, a smooth lane change creates immediate space. Simultaneously ease.", lesson:"Space management and smooth inputs prevent four-wheeler emergencies." },
      { text:"Flash lights and tailgate until they move over", outcome:"bad", result:"Aggressive Driving Violation", detail:"Tailgating and light-flashing are aggressive driving violations for a CMV driver. You would bear.", lesson:"Never respond to four-wheeler aggression with aggression. Create space instead." },
    ]},
  { id:"s12", track:"all", title:"Wrong Turn - Low Bridge Ahead", icon:"🌉", category:"Road Skill", difficulty:"Intermediate",
    scenario:"Following GPS you turned on a county road. Sign ahead says 11 ft 8 in clearance. Your truck is 13.",
    options:[
      { text:"Go slowly - it might be close but you will fit", outcome:"bad", result:"Structural Collision", detail:"13 ft 6 in will not fit under 11 ft 8 in. A bridge strike damages or destroys your truck,.", lesson:"If you cannot verify clearance you cannot go. Period. Ever." },
      { text:"Back up until you can safely turn around", outcome:"good", result:"Correct and Necessary", detail:"Backing up on a public road requires hazard lights, good mirrors work, and possibly a spotter. It.", lesson:"Back up no matter how inconvenient. A bridge strike ends careers and lives." },
      { text:"Ask traffic behind you to back up so you can reverse", outcome:"good", result:"Collaborative but Slow", detail:"Getting traffic behind you to back up is sometimes necessary when backing alone is unsafe. Hazard.", lesson:"Use other drivers as safety resources when necessary. Communicate clearly." },
    ]},
  { id:"s13", track:"all", title:"Losing Load at Highway Speed", icon:"📦", category:"Road Skill", difficulty:"Expert",
    scenario:"At 70 mph on I-10 a strap on your flatbed snaps. You can see tarps shifting in your mirrors. One.",
    options:[
      { text:"Maintain speed to minimize the transition - pull off at next exit", outcome:"bad", result:"Catastrophic Risk", detail:"An unsecured load at 70 mph is a road hazard that can kill the drivers behind you. Continuing to.", lesson:"Unsecured load = pull over immediately. No exit is acceptable." },
      { text:"Signal, check mirrors, pull over immediately, activate hazards", outcome:"good", result:"Correct Emergency Response", detail:"Pull to the safest available spot immediately. Activate emergency flashers and set triangles at.", lesson:"Immediate stop, hazards, triangles, inspect and re-secure. In that order." },
      { text:"Slow down gradually to reduce aerodynamic lift on the tarp", outcome:"bad", result:"Inadequate Response", detail:"Slowing down while still moving does not re-secure a failed strap. Load shift at any speed is a.", lesson:"Slowing down does not fix an unsecured load. Stop immediately." },
    ]},
  { id:"s14", track:"company", title:"Dispatcher Pressure to Violate HOS", icon:"📱", category:"Business", difficulty:"Intermediate",
    scenario:"Your dispatcher calls and tells you to push past your HOS limit to make a detention-sensitive load..",
    options:[
      { text:"Trust the dispatcher - they said they would cover you", outcome:"bad", result:"You Will Not Be Covered", text:"Dispatchers cannot legally indemnify a driver for HOS violations. If you are inspected, in an.", lesson:"No one can cover an HOS violation. The driver always owns it." },
      { text:"Refuse professionally and document the request in writing", outcome:"good", result:"Correct and Protected", detail:"Declining an illegal instruction and documenting it in writing protects you. Text or email creates.", lesson:"Refuse illegal instructions. Document everything in writing. This protects your CDL and your job." },
      { text:"Compromise by going 30 minutes over - it is a small violation", outcome:"bad", result:"Still a Federal Violation", detail:"There is no small HOS violation. 31 minutes over is the same federal violation as 3 hours over. The.", lesson:"Any HOS violation is a federal violation. There is no minor version." },
    ]},
  { id:"s15", track:"company", title:"Customer Conflict at Delivery", icon:"🏭", category:"Business", difficulty:"Beginner",
    scenario:"At delivery the receiver refuses your load, claiming damage. You inspected the freight at pickup.",
    options:[
      { text:"Argue that the damage happened on their end and refuse to take it back", outcome:"bad", result:"Escalation Without Resolution", detail:"Getting into a dock argument accomplishes nothing and makes you look unprofessional. Even if you.", lesson:"Document everything and escalate professionally. Never dock-argue." },
      { text:"Show your pickup photos, note dispute on BOL, call dispatch", outcome:"good", result:"Professional and Protected", detail:"Your photos are your evidence. Note the refusal and reason on the BOL, call dispatch immediately,.", lesson:"Photos + BOL notation + immediate dispatch contact = proper freight dispute protocol." },
      { text:"Just take the load back without documentation", outcome:"bad", result:"Serious Mistake", detail:"Accepting a refused load without documenting the dispute creates liability. Your company may not.", lesson:"Never accept or return freight without full written documentation of the dispute." },
    ]},
  { id:"s16", track:"owner", title:"Insurance Claim After Minor Accident", icon:"🚘", category:"Business", difficulty:"Expert",
    scenario:"At slow speed in a truck stop you clipped a parked trailer. No injuries. Minor damage to both. The.",
    options:[
      { text:"Exchange info privately - it is minor damage and you need no claim", outcome:"bad", result:"Serious Risk", detail:"Private settlements in trucking are legally complex. If the other driver later files a claim.", lesson:"Never settle privately in trucking. Always report to your insurance carrier." },
      { text:"Call your insurance immediately and report the incident", outcome:"good", result:"Correct Protocol", detail:"Report every incident to your insurance carrier, even minor ones. Let them assess and handle the.", lesson:"Report every incident to insurance immediately. That is what coverage is for." },
      { text:"File a police report and let insurance handle it", outcome:"good", result:"Also Correct", detail:"Getting law enforcement involved in truck stop incidents provides an official record, which.", lesson:"Police report + insurance report = full protection. Both are correct." },
    ]},
  { id:"s17", track:"all", title:"Carbon Monoxide Warning in Cab", icon:"⚠️", category:"Emergency", difficulty:"Expert",
    scenario:"Your CO alarm goes off while driving on the highway. You feel slightly dizzy and have a headache..",
    options:[
      { text:"Open windows, exit at next exit, stop for fresh air", outcome:"bad", result:"Dangerous Delay", detail:"Carbon monoxide incapacitates quickly. By the time you reach the next exit your decision-making is.", lesson:"CO alarm means pull over immediately and evacuate. No delays." },
      { text:"Pull over immediately, open all windows and doors, evacuate cab", outcome:"good", result:"Life-Saving Response", detail:"CO is odorless and colorless. Trust the alarm. Pull over at the first safe spot, open everything.", lesson:"Immediate evacuation is the only correct CO response. Trust the alarm." },
      { text:"Turn the heater off and keep driving to a truck stop", outcome:"bad", result:"Continued CO Exposure", detail:"Turning off the heater does not remove CO already in the cab. Continuing to drive while exposed to.", lesson:"CO alarms require immediate stop and evacuation. No driving." },
    ]},
  { id:"s18", track:"all", title:"Winter Storm Closure Decision", icon:"❄️", category:"Road Skill", difficulty:"Intermediate",
    scenario:"I-80 Wyoming just issued a chain requirement advisory. Your chains are back at the terminal in.",
    options:[
      { text:"Push through - you have good winter tires and experience", outcome:"bad", result:"Judgment and Legal Error", detail:"Chain requirement advisories carry fines for non-compliance. More importantly, I-80 Wyoming in a.", lesson:"Chain requirements are law. No chains means pull over, not push through." },
      { text:"Pull over at the next safe area and wait for conditions to clear", outcome:"good", result:"Right Call", detail:"Pulling over protects you legally, protects your CDL, and keeps you alive. Call dispatch with.", lesson:"Waiting out a chain requirement is always the right call. Loads can be rescheduled. Lives cannot." },
      { text:"Turn around and go back to Cheyenne for your chains", outcome:"good", result:"Compliant Option", detail:"If it is safe to turn around and get proper equipment, this is a valid option. It costs time but.", lesson:"Compliance with chain requirements is non-negotiable. Getting proper equipment is always an option." },
    ]},
  { id:"s19", track:"all", title:"Medical Emergency While Driving", icon:"🚑", category:"Emergency", difficulty:"Expert",
    scenario:"You are driving on a 4-lane highway and feel severe chest pain radiating to your left arm. You feel.",
    options:[
      { text:"Push to the next exit and call for help there", outcome:"bad", result:"Potentially Fatal Decision", text:"Chest pain radiating to the arm is a classic heart attack presentation. You have minutes. Driving 5.", lesson:"Medical emergency means pull over NOW. Do not drive to an exit. Every second counts." },
      { text:"Pull to the shoulder immediately, activate hazards, call 911", outcome:"good", result:"Correct Life-Saving Response", text:"Pull to the right shoulder immediately. Turn on all emergency lights. Call 911. Unlock your door if.", lesson:"Immediate stop, hazards, 911. This is the only correct response to a medical emergency." },
      { text:"Call dispatch first to let them know what is happening", outcome:"bad", result:"Wrong Priority Order", detail:"Dispatch cannot send help or call 911 faster than you can. Every second spent on a dispatch call.", lesson:"911 always before dispatch in a medical emergency. Location accuracy saves lives." },
    ]},
  { id:"s20", track:"beginner", title:"First Solo Dock Backup", icon:"🏭", category:"Road Skill", difficulty:"Beginner",
    scenario:"Your first solo delivery. Tight dock, 4 trailers on each side. A dock foreman is watching. You have.",
    options:[
      { text:"Keep trying - you will get it eventually", outcome:"bad", result:"Pride Over Safety", detail:"After 4 failed attempts in a tight dock with observers, continuing to attempt without resetting.", lesson:"After multiple failed attempts, reset completely. Every experienced driver has done this." },
      { text:"Get out, G.O.A.L., take a breath, ask for a spotter", outcome:"good", result:"Professional Move", detail:"Get Out And Look. Reset your reference points. Ask the foreman for a spotter - they do this every.", lesson:"G.O.A.L. every time. Asking for a spotter is professionalism, not weakness." },
      { text:"Call your trainer and have them talk you through it", outcome:"good", result:"Smart Use of Resources", detail:"Calling your trainer is a legitimate option on early solo runs. Getting verbal guidance resets your.", lesson:"Using your training network on early solos is professional. You are not expected to know everything yet." },
    ]}, ];

// ─── GLOSSARY ─────────────────────────────────────────────────────────────────
const GLOSSARY = [
  { term:"BOL (Bill of Lading)", def:"The legal contract between shipper and carrier documenting freight type, quantity, condition, and delivery terms. Always inspect cargo before signing." },
  { term:"Bobtail", def:"A semi truck operating without a trailer attached. Bobtail trucks handle differently due to weight distribution - braking distances change significantly." },
  { term:"CDL (Commercial Drivers License)", def:"Federal license required to operate commercial vehicles. Class A: combination vehicles. Class B: single vehicles over 26,001 lbs. Class C: special hazmat or passenger." },
  { term:"CSA Score", def:"FMCSA Compliance, Safety, Accountability score based on inspections and violations. Lower is better. High scores trigger interventions and affect employment." },
  { term:"Deadhead Miles", def:"Miles driven with an empty trailer generating no revenue. All operating costs still apply. Minimizing deadhead improves profitability significantly." },
  { term:"DOT Physical", def:"Medical examination required to maintain CDL. Must be completed by a certified medical examiner. Valid for up to 24 months for healthy drivers." },
  { term:"DVIR (Driver Vehicle Inspection Report)", def:"Required written report documenting pre-trip and post-trip vehicle inspection. Must note any defects. Kept for 90 days." },
  { term:"ELD (Electronic Logging Device)", def:"Federally mandated device that automatically records driving time and duty status. Replaced paper logs in 2019 for most carriers." },
  { term:"Fifth Wheel", def:"The coupling plate on the tractor that accepts the trailer kingpin. Must be properly greased, locked, and inspected before every trip." },
  { term:"Factoring", def:"Financial service where a company buys your receivables at a discount (2-5%) and pays immediately. Solves cash flow issues for new owner-operators." },
  { term:"G.O.A.L.", def:"Get Out And Look. The mandatory practice of physically checking your surroundings before and during any backing maneuver. Non-negotiable safety rule." },
  { term:"Gross Combination Weight Rating (GCWR)", def:"Maximum operating weight of a tractor-trailer combination including vehicle, cargo, fuel, and passengers as specified by manufacturer." },
  { term:"HOS (Hours of Service)", def:"FMCSA rules limiting driving and on-duty time. Key limits: 11 hrs driving, 14 hr window, 30-min break after 8 hrs, 60/70-hr weekly limit." },
  { term:"IFTA (International Fuel Tax Agreement)", def:"Agreement between US states and Canadian provinces allowing truckers to report fuel taxes in their base state. Quarterly filings required." },
  { term:"Kingpin", def:"The steel pin on the underside of a trailer that locks into the fifth wheel. Must be properly seated and locked before movement." },
  { term:"MC Number", def:"Motor Carrier Number issued by FMCSA authorizing operation as a for-hire carrier. Required before hauling loads for brokers or shippers." },
  { term:"OOS (Out of Service)", def:"Designation by DOT inspector placing driver or vehicle in Out of Service status. Vehicle cannot move until violation is corrected." },
  { term:"Per Diem", def:"Tax-free daily allowance for meals and incidentals when traveling away from home. Currently $69/day for truck drivers under IRS guidelines." },
  { term:"Placard", def:"Required signage on vehicles transporting hazardous materials. Indicates hazmat class. Specific placards required for specific materials and quantities." },
  { term:"Reefer", def:"Refrigerated trailer. Temperature-controlled units for perishable freight. Requires additional certification and knowledge of temperature management." },
  { term:"Tandems", def:"The paired rear axle groups on a semi trailer. Sliding tandems forward or backward redistributes weight between drive and trailer axles." },
  { term:"Tare Weight", def:"The weight of the empty vehicle without cargo. GVWR minus tare weight equals payload capacity." },
  { term:"UCR (Unified Carrier Registration)", def:"Annual registration required for all interstate commercial motor carriers. Fee based on fleet size. Non-compliance results in fines." },
];

// ─── VIDEO MAP ────────────────────────────────────────────────────────────────
const VIDEO_MAP = {
  s1:  { good:"8hO7lVdYB3I", bad:"lOqvJ0u0EvY" },
  s2:  { good:"HTCVzQUQqFQ", bad:"_PLACEHOLDER_" },
  s3:  { good:"O-XHDslWM4Y", bad:"KTHd1HRuVmk" },
  s4:  { good:"nAYEEdYml9o", bad:"sW0CYO6CxCs" },
  s5:  { good:"_PLACEHOLDER_", bad:"_PLACEHOLDER_" },
  s6:  { good:"3ZI1RWVg38w", bad:"6gufHVAoXFQ" },
  s7:  { good:"_PLACEHOLDER_", bad:"zyniuKLffpw" },
  s8:  { good:"JV7eeeiG-cA", bad:"_PLACEHOLDER_" },
  s9:  { good:"_PLACEHOLDER_", bad:"_PLACEHOLDER_" },
  s10:  { good:"zheEqwxStHo", bad:"_PLACEHOLDER_" },
  s11:  { good:"EnmGnBzFxAs", bad:"_PLACEHOLDER_" },
  s12:  { good:"LqtUV1TDYr4", bad:"pKlmaRu9k-w" },
  s13:  { good:"tvFvnMgYsbo", bad:"PMoYYsp-wXM" },
  s14:  { good:"l4yFHtW8bo8", bad:"_PLACEHOLDER_" },
  s15:  { good:"_PLACEHOLDER_", bad:"_PLACEHOLDER_" },
  s16:  { good:"_PLACEHOLDER_", bad:"_PLACEHOLDER_" },
  s17:  { good:"VyyYwqvIVGU", bad:"_PLACEHOLDER_" },
  s18:  { good:"_PLACEHOLDER_", bad:"_PLACEHOLDER_" },
  s19:  { good:"Euh2IUEqbmI", bad:"_PLACEHOLDER_" },
  s20:  { good:"_PLACEHOLDER_", bad:"_PLACEHOLDER_" },
};

const PHOTO_MAP = {
  // Each scenario has a "good" photo (correct response) and "bad" photo (wrong response)
  s1:  { good:"https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Tire blowout
  s2:  { good:"https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=600", bad:"https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?w=600" },   // Brake fade
  s3:  { good:"https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?w=600",   bad:"https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?w=600" },   // Weigh station
  s4:  { good:"https://images.pexels.com/photos/4480769/pexels-photo-4480769.jpeg?w=600", bad:"https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=600" },   // Dock backup
  s5:  { good:"https://images.pexels.com/photos/7706429/pexels-photo-7706429.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // HOS violation
  s6:  { good:"https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?w=600", bad:"https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=600" },   // Pre-trip defect
  s7:  { good:"https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Ice/jackknife
  s8:  { good:"https://images.pexels.com/photos/7706429/pexels-photo-7706429.jpeg?w=600", bad:"https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?w=600" },   // Low rate broker
  s9:  { good:"https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Non-payment
  s10: { good:"https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?w=600",   bad:"https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=600" },   // Breakdown
  s11: { good:"https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // 4-Wheeler cutoff
  s12: { good:"https://images.pexels.com/photos/4480769/pexels-photo-4480769.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Low bridge
  s13: { good:"https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?w=600", bad:"https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?w=600" },   // Losing load
  s14: { good:"https://images.pexels.com/photos/7706429/pexels-photo-7706429.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Dispatcher pressure
  s15: { good:"https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=600", bad:"https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?w=600" },   // Dock dispute
  s16: { good:"https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?w=600",   bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Insurance claim
  s17: { good:"https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=600", bad:"https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?w=600" },   // CO alarm
  s18: { good:"https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // Winter storm
  s19: { good:"https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?w=600", bad:"https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?w=600" },   // Medical emergency
  s20: { good:"https://images.pexels.com/photos/4480769/pexels-photo-4480769.jpeg?w=600", bad:"https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?w=600" },   // First dock backup
};

// ─── STATE CDL QUESTIONS ──────────────────────────────────────────────────────
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut", "Delaware","Florida","Georgia","Idaho","Illinois","Indiana","Iowa","Kansas",
  "Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire", "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia", "Wisconsin","Wyoming"
];

const STATE_Q = {
  Texas:[
    {q:"In Texas, what is the minimum age to obtain a Class A CDL?",opts:["18 (intrastate only)","19","21","23"],ans:0,exp:"In Texas you may obtain a Class A CDL at 18 for intrastate (within Texas) driving only. Interstate driving requires age 21 per federal law.",cat:"general"},
    {q:"Texas requires a medical certificate be kept on file with TxDPS for how long?",opts:["1 year","2 years","3 years","5 years"],ans:1,exp:"Texas requires drivers to keep medical certificates current and on file. The standard DOT medical card is valid for up to 2 years.",cat:"general"},
    {q:"In Texas, what blood alcohol content (BAC) is the legal limit for CDL drivers?",opts:[".08%",".06%",".04%",".02%"],ans:2,exp:"Federal law enforced in Texas sets the CDL BAC limit at .04%, half the standard limit for regular drivers.",cat:"general"},
  ], California:[
    {q:"California requires CDL drivers to submit a medical certificate to the DMV within how many days of obtaining it?",opts:["15 days","30 days","45 days","60 days"],ans:1,exp:"California requires CDL holders to submit their medical examiner certificate to DMV within 30 days of issuance.",cat:"general"},
    {q:"In California, what is the speed limit for commercial trucks on most highways unless otherwise posted?",opts:["65 mph","60 mph","55 mph","70 mph"],ans:2,exp:"California Vehicle Code sets a 55 mph maximum speed limit for commercial vehicles over 10,000 lbs on most highways.",cat:"general"},
    {q:"California's CARB regulations require trucks operating in the state to meet specific emissions standards. Failure to comply can result in fines up to:",opts:["$1,000","$5,000","$10,000","$25,000"],ans:2,exp:"California Air Resources Board (CARB) violations can result in fines up to $10,000 per day for non-compliant vehicles operating in California.",cat:"general"},
  ], Florida:[
    {q:"In Florida, a CMV driver convicted of a DUI in a personal vehicle will have their CDL disqualified for:",opts:["30 days","6 months","1 year","Permanently"],ans:2,exp:"A DUI conviction in any vehicle, personal or commercial, results in a minimum 1-year CDL disqualification in Florida.",cat:"general"},
    {q:"Florida requires annual vehicle inspections for commercial vehicles. Who is authorized to perform these inspections?",opts:["Any mechanic","Florida Highway Patrol only","FMCSA-certified inspectors","Licensed Florida inspection stations"],ans:2,exp:"Commercial vehicle inspections must be performed by FMCSA-certified inspectors to comply with federal and Florida state requirements.",cat:"general"},
    {q:"What is the maximum fine for a first-offense overweight violation in Florida?",opts:["$100","$500","$1,000","Up to $10,000 depending on severity"],ans:3,exp:"Florida overweight fines are calculated based on how many pounds over the limit the vehicle is. Severe overweight violations can result in fines exceeding $10,000.",cat:"general"},
  ], "New York":[
    {q:"New York State requires CDL holders to notify the DMV of a traffic conviction in another state within:",opts:["24 hours","30 days","60 days","They are automatically notified"],ans:1,exp:"New York CDL holders must notify the DMV within 30 days of any traffic conviction in any state, even if the conviction is in their personal vehicle.",cat:"general"},
    {q:"New York City has specific restrictions for commercial vehicles. Trucks over what weight require a NYC DOT permit for certain routes?",opts:["10,000 lbs","26,000 lbs","33,000 lbs","80,000 lbs"],ans:1,exp:"Commercial vehicles over 26,000 lbs GVWR require NYC DOT permits for restricted routes and bridges in New York City.",cat:"general"},
  ], Ohio:[
    {q:"Ohio CDL drivers must report a DUI or refusal to take a chemical test to their employer within:",opts:["24 hours","72 hours","7 days","30 days"],ans:0,exp:"Ohio law (aligned with federal FMCSA regulations) requires CDL drivers to notify their employer within 24 hours of any DUI or chemical test refusal.",cat:"general"},
    {q:"What is Ohio's maximum allowable gross vehicle weight on interstate highways?",opts:["73,280 lbs","80,000 lbs","88,000 lbs","105,500 lbs"],ans:1,exp:"Ohio follows the federal standard maximum gross vehicle weight of 80,000 lbs on interstate highways without special permits.",cat:"general"},
  ], Illinois:[
    {q:"Illinois requires CDL holders to have their medical certificate submitted to the Secretary of State. How is this done?",opts:["Mail only","In person at SOS office","Through the National Registry electronic system","Fax only"],ans:2,exp:"Illinois uses the FMCSA National Registry of Certified Medical Examiners electronic reporting system for medical certificate submissions.",cat:"general"},
    {q:"What is the Illinois toll rate penalty for a commercial vehicle that goes through an I-Pass lane without a transponder?",opts:["Double the posted toll","Triple the posted toll","$20 fine plus toll","$50 fine plus double toll"],ans:2,exp:"Illinois charges a $20 violation notice fee plus the original toll amount for commercial vehicles using electronic toll lanes without a valid transponder.",cat:"general"},
  ], Georgia:[
    {q:"Georgia requires commercial vehicle drivers involved in an accident to report it to the Georgia DOT if damages exceed:",opts:["$500","$1,000","$5,000","$10,000"],ans:1,exp:"Georgia law requires reporting accidents involving commercial vehicles when property damage exceeds $1,000 or when any injury or death occurs.",cat:"general"},
    {q:"In Georgia, how long does a CDL disqualification last for a first-offense railroad crossing violation?",opts:["30 days","60 days","1 year","Lifetime"],ans:1,exp:"A first offense of failing to stop at a railroad crossing results in a 60-day CDL disqualification in Georgia under FMCSA regulations.",cat:"general"},
  ], Pennsylvania:[
    {q:"Pennsylvania requires commercial vehicles to stop at weigh stations on interstates. Which vehicles are exempt?",opts:["Empty trailers","Vehicles under 17,000 lbs GVWR","Pickup trucks with tool boxes","Livestock carriers"],ans:1,exp:"In Pennsylvania, vehicles with a GVWR of 17,000 lbs or less are generally exempt from stopping at weigh stations.",cat:"general"},
    {q:"Pennsylvania has a specific law about idling commercial vehicles. The maximum continuous idle time is:",opts:["3 minutes","5 minutes","10 minutes","15 minutes"],ans:1,exp:"Pennsylvania restricts diesel commercial vehicle idling to a maximum of 5 consecutive minutes, with exceptions for safety and extreme temperatures.",cat:"general"},
  ], Tennessee:[
    {q:"Tennessee has designated truck routes in major cities. Operating off a designated truck route without a permit results in fines up to:",opts:["$50","$100","$250","$500"],ans:2,exp:"Tennessee fines for operating commercial vehicles off designated truck routes without permits can reach $250 per violation.",cat:"general"},
  ], "North Carolina":[
    {q:"North Carolina requires CDL holders with a medical variance or exemption to carry documentation in the vehicle at all times. This documentation must be renewed every:",opts:["6 months","1 year","2 years","When the medical condition changes"],ans:1,exp:"Medical variances and exemptions for CDL drivers in North Carolina must be renewed annually and kept in the vehicle during operation.",cat:"general"},
  ], };

// ─── RATE CALCULATOR DATA ─────────────────────────────────────────────────────
const FUEL_PRICE_DEFAULT = 3.60; // National average diesel

// ─── COMMUNITY POSTS (seed data) ──────────────────────────────────────────────
const SEED_POSTS = [
  {id:"p1", author:"Big Earl", avatar:"🧔🏿", role:"AI Mentor", time:"2 days ago",
   q:"What is the single biggest mistake new CDL students make when studying for the knowledge test?",
   a:"They memorize answers instead of understanding WHY. The DMV changes question wording constantly. Understand the concept and no wording trick will fool you. Read the CDL manual for your state - once cover to cover, then use practice tests to find your gaps.", likes:47, tag:"CDL Prep"},
  {id:"p2", author:"TexasTrucker88", avatar:"🤠", role:"Company Driver", time:"5 hours ago",
   q:"Best fuel stop between Dallas and El Paso on I-10?",
   a:"Flying J in Van Horn. Cheaper than anything in Midland. Fill up there heading west, you can make El Paso easy.", likes:12, tag:"Fuel"},
  {id:"p3", author:"OwnerOpMike", avatar:"🚛", role:"Owner-Operator", time:"1 day ago",
   q:"Broker offering $2.10/mile on a 800-mile round trip. My CPM is $1.72. Worth it?",
   a:"Run the full math first. 800 miles x $2.10 = $1,680 gross. 800 x $1.72 = $1,376 in costs. That is $304 net. Ask yourself: is $304 for roughly 16-18 hours of work worth it? If you have nothing else lined up, possibly. But always counter first - ask for $2.25.", likes:31, tag:"Business"},
  {id:"p4", author:"NewDriver_Keisha", avatar:"👩‍✈️", role:"CDL Student", time:"3 hours ago",
   q:"Failed my air brakes test twice. Any tips?", a:"", likes:8, tag:"CDL Prep"}, ];

const PLANS = [
  { id:"free",     name:"Free",           price:"$0",    period:"forever",   color:C.gray1,  track:"all",
    features:["First 3 lessons of your chosen path","General Knowledge CDL practice","3 simulations preview","Big Earl AI mentor (limited)"] },
  { id:"student",  name:"CDL Student",    price:"$9.99", period:"/mo",       color:C.blue,   badge:"FOR BEGINNERS", track:"beginner",
    features:["All 12 beginner lessons fully unlocked","Full CDL test prep - all categories","All 20 simulations","Pre-Trip Trainer with real photos","Streak tracking + Big Earl AI","Progress analytics"] },
  { id:"company",  name:"Company Driver", price:"$9.99", period:"/mo",       color:"#10B981", badge:"LEVEL UP", track:"company",
    features:["All 10 company driver lessons","ELD compliance, cargo, accident prep","Advanced CDL prep + state-specific","All 20 simulations","Big Earl AI mentor unlimited","Progress analytics"] },
  { id:"owner",    name:"Owner-Operator", price:"$19.99",period:"/mo",       color:C.amber,  badge:"MOST POWERFUL", track:"owner",
    features:["All 12 owner-operator lessons","Rate calculator + IFTA tools","Load board strategy + broker negotiation","Insurance, taxes, business setup","Big Earl AI mentor unlimited","All simulations + CDL prep"] },
  { id:"lifetime", name:"Lifetime Access",price:"$99",   period:"one-time",  color:"#A78BFA", badge:"BEST VALUE", track:"all",
    features:["All 3 paths fully unlocked - forever","Every lesson, simulation, and tool","Rate calculator + all owner-op tools","Big Earl AI mentor unlimited","All future content included","No monthly fees - ever"] },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Tag({ label, color, small }) {
  return <span style={{ background:`${color}20`, color, fontSize:small?9:10, fontFamily:"Barlow,sans-serif", fontWeight:700, letterSpacing:1.5, padding:small?"2px 6px":"3px 9px", borderRadius:20, border:`1px solid ${color}35`, whiteSpace:"nowrap" }}>{label}</span>;
}
function XPBadge({ xp, color }) {
  return <span style={{ background:`${color}15`, color, fontSize:10, fontFamily:"Barlow,sans-serif", fontWeight:700, padding:"3px 9px", borderRadius:20 }}>+{xp} XP</span>;
}
function PBar({ value, color, height }) {
  const h = height || 6;
  return (
    <div style={{ background:C.bg3, borderRadius:4, height:h, overflow:"hidden" }}>
      <div style={{ width:`${Math.min(100,Math.max(0,value))}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}bb)`, borderRadius:4, transition:"width 0.8s ease" }} />
    </div>
  ); }
function Card({ children, style, onClick, accent, glow }) {
  return (
    <div onClick={onClick} style={{
      background:"rgba(19,22,30,0.96)", border:`1px solid ${accent?`${accent}30`:C.border}`,
      borderRadius:16, padding:18, cursor:onClick?"pointer":"default",
      position:"relative", overflow:"hidden", boxShadow:glow?`0 0 20px ${glow}20`:"0 2px 12px rgba(0,0,0,0.4)",
      ...style }}>
      {accent && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:accent, borderRadius:"16px 0 0 16px" }} />}
      {children}
    </div>
  ); }
function PageHeader({ title, subtitle, color, back, onBack, children }) {
  const c = color || C.amber;
  return (
    <div style={{ background:"rgba(13,15,20,0.97)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, padding:"50px 24px 18px" }}>
      {back && <button onClick={onBack} style={{ background:"none", border:"none", color:c,
        fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:600, cursor:"pointer",
        letterSpacing:0.5, padding:0, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:16 }}>←</span> {back}
      </button>}
      {subtitle && <div style={{ color:c, fontSize:10, letterSpacing:3, fontFamily:"Barlow,sans-serif", fontWeight:600, marginBottom:6 }}>{subtitle}</div>}
      <div style={{ color:"#FFFFFF", fontSize:24, fontWeight:700 }}>{title}</div>
      {children}
    </div>
  ); }
function DifficultyTag({ level }) {
  const colors = { Beginner:C.green, Intermediate:C.amber, Expert:C.red };
  return <Tag label={level} color={colors[level]||C.amber} small />;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

// ─── GLOBAL BIG EARL CHAT MODAL ───────────────────────────────────────────────
function EarlModal({ open, onClose, track }) {
  const [messages, setMessages] = useState([
    { role:"assistant", text:"What's on your mind, driver? Ask me anything about routes, regs, rates, backing, breakdowns, or running your business." } ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (q) => {
    if (!q.trim()) return;
    const newMessages = [...messages, { role:"user", text:q }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const history = newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:600,
          system:"You are Big Earl, a no-nonsense 30-year veteran trucker with 3.2 million miles. Give direct, practical advice. Keep answers under 3 sentences unless asked for more. Use trucker lingo naturally.",
          messages: history,
        }) });
      const data = await response.json();
      const reply = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("") || getFallback(q);
      setMessages(m => [...m, { role:"assistant", text:reply }]);
    } catch(e) {
      setMessages(m => [...m, { role:"assistant", text:getFallback(q) }]);
    }
    setLoading(false);
  };

  const getFallback = (q) => {
    const ql = q.toLowerCase();
    if (ql.includes("rate") || ql.includes("broker") || ql.includes("load"))
      return "Never take the first number a broker gives you. Counter every time - even $0.10/mile more on 500 miles is $50 in your pocket.";
    if (ql.includes("hos") || ql.includes("hours") || ql.includes("14"))
      return "The 14-hour clock never stops once it starts. Plan your day around it, not around your miles.";
    if (ql.includes("back") || ql.includes("dock") || ql.includes("reverse"))
      return "GOAL - Get Out And Look - every single time before you back. I do not care how experienced you are.";
    if (ql.includes("pre-trip") || ql.includes("inspection"))
      return "A pre-trip is not optional and not a formality. It is your legal protection if something breaks on the road.";
    if (ql.includes("blowout") || ql.includes("flat"))
      return "Steer tire blowout: grip the wheel, slight throttle to stabilize, do NOT brake hard. Let the truck slow naturally then ease to the shoulder.";
    if (ql.includes("weather") || ql.includes("ice") || ql.includes("snow"))
      return "No load is worth dying for. If conditions are bad enough you are white-knuckling it, you are already past the point where you should have stopped.";
    if (ql.includes("fuel") || ql.includes("ifta"))
      return "Texas and New Jersey diesel is cheaper than California and Pennsylvania. Plan your fill-ups like you plan your miles.";
    if (ql.includes("dot") || ql.includes("authority") || ql.includes("mc number"))
      return "Get your MC number through FMCSA.dot.gov directly. Do not pay a third party $500 to do what you can do yourself for $300.";
    return "Good question. Run your miles smart, inspect every day, and never haul below your cost per mile. That is the whole game.";
  };

  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9998, display:"flex", flexDirection:"column" }}>
      <div onClick={onClose} style={{ flex:1, background:"rgba(0,0,0,0.6)" }} />
      <div style={{ background:C.bg, borderRadius:"20px 20px 0 0", maxHeight:"70vh", display:"flex", flexDirection:"column", border:"1px solid "+C.border }}>
        <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid "+C.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:24 }}>🧔🏿</span>
            <div>
              <div style={{ color:C.amber, fontSize:14, fontWeight:700, fontFamily:"Oswald,sans-serif", letterSpacing:1 }}>BIG EARL</div>
              <div style={{ color:C.green, fontSize:10, fontFamily:"Barlow,sans-serif" }}>● Online</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:C.bg2, border:"none", color:C.gray2, fontSize:18, width:32, height:32, borderRadius:"50%", cursor:"pointer" }}>✕</button>
        </div>
        <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", gap:8, justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
              {msg.role==="assistant" && <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>🧔🏿</span>}
              <div style={{ background:msg.role==="user"?C.amber+"20":C.bg2, border:"1px solid "+(msg.role==="user"?C.amber+"40":C.border), borderRadius:12, padding:"10px 14px", maxWidth:"82%", color:C.offWhite, fontSize:13, fontFamily:"Barlow,sans-serif", lineHeight:1.6 }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:20 }}>🧔🏿</span>
              <div style={{ background:C.bg2, border:"1px solid "+C.border, borderRadius:12, padding:"10px 14px", color:C.gray2, fontSize:13, fontFamily:"Barlow,sans-serif" }}>Earl is thinking...</div>
            </div>
          )}
        </div>
        <div style={{ padding:"10px 16px 20px", borderTop:"1px solid "+C.border, display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Ask Earl anything..." style={{ flex:1, background:C.bg2, border:"1px solid "+C.border, borderRadius:24, padding:"10px 16px", color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", outline:"none" }} />
          <button onClick={()=>send(input)} disabled={loading||!input.trim()} style={{ background:C.amber, border:"none", borderRadius:24, padding:"10px 18px", color:"#000", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Barlow,sans-serif" }}>Send</button>
        </div>
      </div>
    </div> );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const saved = lsLoad();
  const [appState, setAppState]     = useState(saved?.appState || "splash");
  const [track, setTrack]           = useState(saved?.track || null);
  const [progress, setProgress]     = useState(saved?.progress || { completed:[], simScores:{}, cdlScores:{}, xp:0, streak:0, lastDay:"", bookmarked:[], missedQuestions:[], weakAreas:{} });
  const [profile, setProfile]       = useState(saved?.profile || { name:"Driver", plan:"free", state:"Texas" });
  const [screen, setScreen]         = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [earlOpen, setEarlOpen]     = useState(false);
  const [tab, setTab]               = useState("home");
  const [user, setUser]             = useState(null);

  useEffect(() => { lsSave({ appState, track, progress, profile }); }, [appState, track, progress, profile]);

  const go = (dest, data) => { setScreen(dest); setScreenData(data || null); };

  const updateProgress = (updates) => setProgress(p => ({ ...p, ...updates }));

  if (appState === "splash") return <SplashScreen onComplete={() => {
    const isNew = !saved?.track;
    if (isNew || !track) { setAppState("onboarding"); }
    else { setAppState("main"); }
  }} onGuest={() => { if (track) setAppState("main"); else setAppState("onboarding"); }} />;

  if (appState === "onboarding") return <OnboardingScreen onComplete={(t) => { setTrack(t); setAppState("main"); }} />;

  return (
    <>
      <EarlModal open={earlOpen} onClose={() => setEarlOpen(false)} track={track} />
      <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:C.bg, position:"relative", fontFamily:"Barlow,sans-serif" }}>
        {/* Screen routing */}
        {tab === "home"    && screen === "home"      && <DashboardScreen go={go} switchTab={(t,s)=>{setTab(t);setScreen(s||t==="home"?"home":t);}} track={track} progress={progress} profile={profile} />}
        {tab === "home"    && screen === "upgrade"   && <UpgradeScreen go={go} profile={profile} setProfile={setProfile} track={track} />}
        {tab === "learn"   && screen === "learn"     && <LearnScreen go={go} track={track} setTrack={setTrack} progress={progress} />}
        {tab === "learn"   && screen === "lesson"    && <LessonScreen go={go} lesson={screenData} progress={progress} updateProgress={updateProgress} track={track} />}
        {tab === "sim"     && screen === "simList"   && <SimListScreen go={go} track={track} progress={progress} />}
        {tab === "sim"     && screen === "simPlay"   && <SimPlayScreen go={go} sim={screenData} progress={progress} updateProgress={updateProgress} />}
        {tab === "cdl"     && screen === "cdl"       && <CDLScreen go={go} progress={progress} updateProgress={updateProgress} profile={profile} />}
        {tab === "cdl"     && screen === "cdlTest"   && <CDLTestScreen go={go} questions={screenData} progress={progress} updateProgress={updateProgress} />}
        {tab === "cdl"     && screen === "cdlResults"&& <CDLResultsScreen go={go} results={screenData} />}
        {tab === "community"&& screen === "community"&& <CommunityScreen go={go} track={track} />}
        {tab === "tools"   && screen === "tools"     && <ToolsScreen go={go} />}
        {tab === "tools"   && screen === "rateCalc"  && <RateCalculatorScreen go={go} />}
        {tab === "tools"   && screen === "pretrip"   && <PreTripScreen go={go} track={track} />}
        {tab === "tools"   && screen === "trafficMap"&& <TrafficMapScreen go={go} />}
        {tab==="tools"   && screen==="jobSearch"  && <JobSearchScreen go={go} track={track} />}
        {tab === "profile" && screen === "profile"   && <ProfileScreen go={go} profile={profile} setProfile={setProfile} track={track} progress={progress} />}
        {tab === "profile" && screen === "bookmarks" && <BookmarksScreen go={go} progress={progress} updateProgress={updateProgress} />}
        {tab === "profile" && screen === "progress"  && <ProgressScreen go={go} progress={progress} track={track} />}
        {tab === "profile" && screen === "feedback"  && <FeedbackScreen go={go} />}
        {tab === "profile" && screen === "news"      && <NewsScreen go={go} />}
        {tab === "profile" && screen === "resources" && <ResourcesScreen go={go} />}
        {tab === "profile" && screen === "glossary"  && <GlossaryScreen go={go} />}
        {tab === "profile" && screen === "tips"      && <TipsScreen go={go} />}

        {/* Big Earl floating button */}
        <button onClick={() => setEarlOpen(true)} style={{ position:"fixed", bottom:80, right:16, width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#2A1A00,#1A0D00)", border:"2px solid "+C.amber+"60", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 20px rgba(0,0,0,0.5)", zIndex:100 }}>
          🧔🏿
        </button>

        {/* Bottom nav */}
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(8,10,16,0.97)", borderTop:"1px solid "+C.border, display:"flex", zIndex:50 }}>
          {[
            { id:"home",      icon:"🏠", label:"Home" },
            { id:"learn",     icon:"📚", label:"Learn",    onTap:()=>{ setScreen("learn"); } },
            { id:"sim",       icon:"🎮", label:"Simulate", onTap:()=>{ setScreen("simList"); } },
            { id:"cdl",       icon:"📋", label:"CDL Prep", onTap:()=>{ setScreen("cdl"); } },
            { id:"community", icon:"💬", label:"Community",onTap:()=>{ setScreen("community"); } },
            { id:"tools",     icon:"🔧", label:"Tools",    onTap:()=>{ setScreen("tools"); } },
            { id:"profile",   icon:"👤", label:"Profile",  onTap:()=>{ setScreen("profile"); } },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if(t.onTap) t.onTap(); else setScreen(t.id==="home"?"home":t.id); }} style={{ flex:1, background:"none", border:"none", padding:"10px 0 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, opacity:tab===t.id?1:0.45 }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <span style={{ color:tab===t.id?C.amber:C.gray2, fontSize:9, fontFamily:"Barlow,sans-serif", fontWeight:600, letterSpacing:0.3 }}>{t.label}</span>
              {tab===t.id && <div style={{ width:16, height:2, background:C.amber, borderRadius:1 }} />}
            </button>
          ))}
        </div>
      </div>
    </> );
}


function GuestWall({ feature, onUpgrade, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end"}}>
      <div style={{background:C.bg,borderRadius:"20px 20px 0 0",padding:32,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🔒</div>
        <div style={{color:C.white,fontSize:20,fontWeight:700,fontFamily:"Oswald,sans-serif",letterSpacing:1,marginBottom:8}}>PRO FEATURE</div>
        <div style={{color:C.gray2,fontSize:14,fontFamily:"Barlow,sans-serif",lineHeight:1.6,marginBottom:24}}>{feature||"Unlock full access to all lessons, simulations, and Big Earl AI."}</div>
        <button onClick={onUpgrade} style={{width:"100%",background:"linear-gradient(135deg,"+C.amber+",#F97316)",border:"none",borderRadius:14,padding:16,color:"#000",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:2,marginBottom:12}}>UPGRADE TO PRO - $9.99/mo</button>
        <button onClick={onClose} style={{width:"100%",background:"none",border:"none",color:C.gray2,fontSize:13,cursor:"pointer",fontFamily:"Barlow,sans-serif",padding:8}}>Maybe later</button>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth, onGuest }) {
  const [mode, setMode]       = useState("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async () => {
    if (!email || !password) { setError("Email and password required."); return; }
    setLoading(true); setError("");
    try {
      const result = mode === "signup"
        ? await supabase.signUp(email, password, name)
        : await supabase.signIn(email, password);
      if (result.error) setError(result.error.message || "Authentication failed.");
      else onAuth(result.user);
    } catch(e) { setError("Connection error. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ fontSize:40, marginBottom:8 }}>🚛</div>
      <div style={{ color:C.amber, fontSize:24, fontWeight:700, fontFamily:"Oswald,sans-serif", letterSpacing:3, marginBottom:4 }}>STREETSMART</div>
      <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif", marginBottom:32 }}>FOR TRUCKERS</div>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", background:C.bg2, borderRadius:12, padding:4, marginBottom:20 }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"10px", background:mode===m?C.amber:"transparent", border:"none", borderRadius:10, color:mode===m?"#000":C.gray2, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Barlow,sans-serif", letterSpacing:1 }}>
              {m==="login"?"SIGN IN":"CREATE ACCOUNT"}
            </button>
          ))}
        </div>
        {mode==="signup" && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:"100%", background:C.bg2, border:"1px solid "+C.border, borderRadius:10, padding:"12px 16px", color:C.white, fontSize:14, fontFamily:"Barlow,sans-serif", marginBottom:10, boxSizing:"border-box", outline:"none" }} />
        )}
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={{ width:"100%", background:C.bg2, border:"1px solid "+C.border, borderRadius:10, padding:"12px 16px", color:C.white, fontSize:14, fontFamily:"Barlow,sans-serif", marginBottom:10, boxSizing:"border-box", outline:"none" }} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{ width:"100%", background:C.bg2, border:"1px solid "+C.border, borderRadius:10, padding:"12px 16px", color:C.white, fontSize:14, fontFamily:"Barlow,sans-serif", marginBottom:16, boxSizing:"border-box", outline:"none" }} />
        {error && <div style={{ color:"#EF5350", fontSize:12, fontFamily:"Barlow,sans-serif", marginBottom:12, textAlign:"center" }}>{error}</div>}
        <button onClick={submit} disabled={loading} style={{ width:"100%", background:"linear-gradient(135deg,"+C.amber+",#F97316)", border:"none", borderRadius:12, padding:16, color:"#000", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Oswald,sans-serif", letterSpacing:2, marginBottom:12 }}>
          {loading ? "..." : mode==="login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
        <button onClick={onGuest} style={{ width:"100%", background:"transparent", border:"1px solid "+C.border, borderRadius:12, padding:14, color:C.gray2, fontSize:13, cursor:"pointer", fontFamily:"Barlow,sans-serif" }}>
          Continue without account
        </button>
      </div>
    </div> );
}

function SplashScreen({ onComplete, onGuest }) {
  return (
    <div style={{ minHeight:"100dvh", background:"#000000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Oswald,sans-serif", position:"relative", overflow:"hidden", }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseBtn{0%,100%{box-shadow:0 8px 32px rgba(245,166,35,.45)}50%{box-shadow:0 8px 52px rgba(245,166,35,.8)}}
      `}</style>

      {/* Content */}
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 24px", width:"100%", }}>

        {/* Logo image - full width, black bg matches perfectly */}
        <div style={{ width:"100%", maxWidth:380, animation:"fadeUp .6s ease .1s both", filter:"drop-shadow(0 16px 48px rgba(245,166,35,.35))", }}>
          <img src={LOGO_IMAGE} alt="Street Smart For Truckers" style={{ width:"100%", display:"block" }} />
        </div>

        {/* Tagline */}
        <div style={{ marginTop:6, color:"#888", fontSize:11, fontFamily:"Barlow,sans-serif", letterSpacing:3.5, textTransform:"uppercase", animation:"fadeUp .6s ease .3s both", }}> TRAIN. SIMULATE. SUCCEED.
        </div>

        {/* CTA */}
        <button onClick={onComplete} style={{
          marginTop:32, width:"100%", maxWidth:300, background:"linear-gradient(135deg,#F5A623,#FF6B00)",
          border:"none", borderRadius:16, padding:"18px 0", color:"#000", fontSize:17, fontWeight:700, letterSpacing:2.5, cursor:"pointer",
          fontFamily:"Oswald,sans-serif", animation:"fadeUp .6s ease .45s both, pulseBtn 2.5s ease 1.2s infinite",
        }}> GET STARTED →
        </button>

        <div style={{ marginTop:18, color:"#333", fontSize:10, fontFamily:"Barlow,sans-serif", letterSpacing:2, animation:"fadeUp .6s ease .6s both" }}>
          CDL PREP · SIMULATIONS · AI MENTOR
        </div>
        <button onClick={onGuest} style={{ marginTop:14, background:"none", border:"none", color:"#555", fontSize:11, fontFamily:"Barlow,sans-serif", cursor:"pointer", letterSpacing:1, animation:"fadeUp .6s ease .7s both" }}>
          Continue without account →
        </button>
      </div>
    </div> );
}

function OnboardingScreen({ onComplete }) {
  return (
    <div style={{ minHeight:"100dvh", position:"relative", overflow:"hidden", fontFamily:"Oswald,sans-serif", }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* Full-screen background */}

      {/* Gradient overlay - heavier at bottom so cards are readable */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,.52) 0%, rgba(0,0,0,.72) 38%, rgba(0,0,0,.94) 65%, #000 100%)", }}/>

      {/* Content */}
      <div style={{ position:"relative", zIndex:2, padding:"64px 24px 44px", minHeight:"100dvh", display:"flex", flexDirection:"column", }}>
        {/* Header */}
        <div style={{ marginBottom:28, animation:"slideUp .5s ease" }}>
          <div style={{ color:C.amber, fontSize:10, letterSpacing:4, fontFamily:"Barlow,sans-serif", fontWeight:600, marginBottom:10, }}>YOUR ROAD STARTS HERE</div>
          <div style={{ color:"#FFFFFF", fontSize:30, fontWeight:700, lineHeight:1.1, textShadow:"0 2px 16px rgba(0,0,0,.9)", }}>EVERY MILE BEGINS WITH ONE CHOICE.</div>
          <div style={{ color:"#C0C8D8", fontSize:14, fontFamily:"Barlow,sans-serif", marginTop:10, lineHeight:1.6, textShadow:"0 1px 8px rgba(0,0,0,.9)", }}>
            CDL student. Company driver. Owner-operator. Tell us where you are and we will take you further.
          </div>
        </div>

        {/* Track cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:13, flex:1 }}>
          {TRACKS.map((t, i) => (
            <button key={t.id} onClick={() => onComplete(t)} style={{
              background:"rgba(8,10,16,0.88)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:`1px solid ${t.color}50`,
              borderRadius:18, padding:"20px 20px", cursor:"pointer", display:"flex",
              alignItems:"center", gap:16, textAlign:"left", animation:`slideUp .5s ease ${i*.1+.15}s both`,
              boxShadow:"0 4px 28px rgba(0,0,0,.55)", }}>
              <div style={{ width:54, height:54, borderRadius:14, background:`${t.color}18`, border:`1px solid ${t.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0, }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:"#FFFFFF", fontSize:17, fontWeight:600, textShadow:"0 1px 6px rgba(0,0,0,.7)", }}>{t.label}</div>
                <div style={{ color:"#9AA3B8", fontSize:13, fontFamily:"Barlow,sans-serif", marginTop:3, }}>{t.desc}</div>
              </div>
              <span style={{ color:t.color, fontSize:22, opacity:.8 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  ); }

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ switchTab, go, track, setTrack, progress, totalLessons, profile }) {
  const done = progress.completed.length;
  const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const currentTrack = track || TRACKS[0];
  const currentPlan = PLANS.find(p => p.id === profile.plan) || PLANS[0];
  const trackLessons = LESSONS[currentTrack.id] || [];
  const trackDone = trackLessons.filter(l => progress.completed.includes(l.id)).length;

  return (
    <div>
      {/* Header */}
      <div style={{ background:"rgba(13,15,20,0.97)", backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, padding:"50px 24px 18px",
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src={LOGO_IMAGE} alt="StreetSmart" style={{ width:44, height:33, objectFit:"cover", objectPosition:"50% 72%", borderRadius:6, }}/>
          <div style={{ fontSize:15, fontWeight:700, letterSpacing:1.5, color:"#FFFFFF" }}>STREET <span style={{ color:C.amber }}>SMART</span></div>
        </div>
        <button onClick={() => switchTab("profile")} style={{ background:`${currentTrack.color}15`, border:`1px solid ${currentTrack.color}30`, borderRadius:20, padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:12 }}>{currentTrack.icon}</span>
          <span style={{ color:currentTrack.color, fontSize:11, fontFamily:"Barlow,sans-serif", fontWeight:600 }}>{currentTrack.short}</span>
        </button>
      </div>

      <div style={{ padding:"20px 24px" }}>
        {/* Welcome card */}
        <Card glow={currentTrack.color} style={{ marginBottom:14, background:`linear-gradient(135deg,${C.bg3},${C.bg2})` }}>
          <div style={{ color:C.gray1, fontSize:10, letterSpacing:3, fontFamily:"Barlow,sans-serif", marginBottom:4 }}>WELCOME BACK, {profile.name.toUpperCase()}</div>
          <div style={{ color:C.white, fontSize:24, fontWeight:700, marginBottom:14 }}>YOUR DASHBOARD</div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:C.gray1, fontSize:12, fontFamily:"Barlow,sans-serif" }}>Overall Progress</span>
            <span style={{ color:currentTrack.color, fontSize:12, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>{pct}%</span>
          </div>
          <PBar value={pct} color={currentTrack.color} height={6} />
        </Card>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          <Card style={{ padding:12, textAlign:"center" }}>
            <div style={{ fontSize:24, marginBottom:4 }}>📚</div>
            <div style={{ color:currentTrack.color, fontSize:18, fontWeight:700 }}>{trackDone}/{trackLessons.length}</div>
            <div style={{ color:C.gray2, fontSize:9, fontFamily:"Barlow,sans-serif", letterSpacing:1 }}>LESSONS</div>
          </Card>
          <Card style={{ padding:12, textAlign:"center", background: progress.streak>=3 ? "rgba(245,166,35,0.08)" : undefined }}>
            <div style={{ fontSize:24, marginBottom:4 }}>{progress.streak>=7?"🔥":progress.streak>=3?"⚡":"📅"}</div>
            <div style={{ color:progress.streak>=3?C.amber:C.gray1, fontSize:18, fontWeight:700 }}>{progress.streak||0}</div>
            <div style={{ color:C.gray2, fontSize:9, fontFamily:"Barlow,sans-serif", letterSpacing:1 }}>DAY STREAK</div>
          </Card>
          <Card style={{ padding:12, textAlign:"center" }}>
            <div style={{ fontSize:24, marginBottom:4 }}>⭐</div>
            <div style={{ color:C.amber, fontSize:16, fontWeight:700 }}>{progress.xp}</div>
            <div style={{ color:C.gray2, fontSize:9, fontFamily:"Barlow,sans-serif", letterSpacing:1 }}>XP EARNED</div>
          </Card>
        </div>
        {/* Streak encouragement banner */}
        {progress.streak >= 1 && (
          <div style={{ background:progress.streak>=7?"linear-gradient(135deg,rgba(245,166,35,0.2),rgba(255,107,0,0.1))":"rgba(245,166,35,0.06)", border:"1px solid "+(progress.streak>=7?C.amber+"50":C.border), borderRadius:12, padding:"10px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{progress.streak>=30?"🏆":progress.streak>=14?"🔥":progress.streak>=7?"⚡":"📈"}</span>
            <div>
              <div style={{ color:progress.streak>=7?C.amber:C.offWhite, fontSize:12, fontWeight:600 }}>
                {progress.streak>=30?"Legend Status! "+progress.streak+" day streak!": progress.streak>=14?"On fire! "+progress.streak+" days straight!":
                 progress.streak>=7?"7-day streak! You are building a habit!": progress.streak>=3?""+progress.streak+"-day streak! Keep it going!":
                 "Day "+progress.streak+" - come back tomorrow to build your streak!"}
              </div>
              <div style={{ color:C.gray2, fontSize:10, fontFamily:"Barlow,sans-serif" }}>
                {progress.streak>=7?"Top 10% of all StreetSmart drivers":"Daily study = faster CDL pass rate"}
              </div>
            </div>
          </div>
        )}

        {/* Quick access */}
        <div style={{ color:C.gray2, fontSize:10, letterSpacing:3, fontFamily:"Barlow,sans-serif", marginBottom:10 }}>QUICK ACCESS</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {[ { icon:"📚", label:"Continue Learning", tab:"learn", sc:"learn" },
            { icon:"🎮", label:"Run a Simulation", tab:"sim", sc:"sim" }, { icon:"📝", label:"CDL Practice Test", tab:"cdl", sc:"cdl" },
            { icon:"📰", label:"Trucker News", tab:"profile", sc:"news" }, { icon:"🔧", label:"Tools", tab:"tools", sc:"tools" },
          ].map((item, i) => (
            <button key={i} onClick={() => switchTab(item.tab, item.sc)}
              style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 14px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, textAlign:"center" }}>
              <span style={{ fontSize:28 }}>{item.icon}</span>
              <span style={{ color:C.offWhite, fontSize:12, fontFamily:"Barlow,sans-serif", fontWeight:500, lineHeight:1.3 }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Big Earl CTA */}
        <div style={{ background:"linear-gradient(135deg,#1A1200,#111827)", border:`1px solid ${C.amberDim}`, borderRadius:16, padding:18, display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:C.amberDim, border:`2px solid ${C.amber}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0, animation:"glow 3s ease infinite" }}>🧔🏿</div>
          <div>
            <div style={{ color:C.amber, fontSize:13, fontWeight:600, letterSpacing:0.5 }}>BIG EARL IS READY</div>
            <div style={{ color:C.gray1, fontSize:12, fontFamily:"Barlow,sans-serif", lineHeight:1.5, marginTop:2 }}>30 years on the road. Ask him anything in simulations and lessons.</div>
          </div>
        </div>

        {/* XP Level */}
        <Card style={{ padding:16, textAlign:"center" }}>
          <div style={{ color:C.gray2, fontSize:10, letterSpacing:2, fontFamily:"Barlow,sans-serif" }}>DRIVER LEVEL</div>
          <div style={{ color:C.white, fontSize:40, fontWeight:700, lineHeight:1 }}>{Math.floor(progress.xp/200)+1}</div>
          <div style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif", marginBottom:10 }}>{progress.xp} XP total</div>
          <PBar value={(progress.xp%200)/2} color={C.amber} height={5} />
        </Card>
      </div>
    </div>
  ); }

// ─── LEARN ────────────────────────────────────────────────────────────────────
function LearnScreen({ go, track, setTrack, progress, authUser }) {
  const isGuest = !authUser;
  const guestAllowed = ["b1","c1","o1"];
  const userTrack = track || TRACKS[0];
  const [active, setActive] = useState(userTrack);
  const trackKey = userTrack.id === "beginner" ? "beginner" : userTrack.id === "company" ? "company" : "owner";
  const lessons = LESSONS[trackKey] || [];
  const color = userTrack.color;
  const doneLessons = lessons.filter(l => progress.completed.includes(l.id)).length;
  return (
    <div>
      <PageHeader title="Learn" subtitle="STRUCTURED LESSONS" color={color}>
        {/* Show user's track badge - no tab switching */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12 }}>
          <div style={{ background:color+"20", border:"1px solid "+color+"50", borderRadius:20, padding:"6px 16px", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:14 }}>{userTrack.icon}</span>
            <span style={{ color:color, fontSize:12, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>
              {userTrack.label.toUpperCase()}
            </span>
          </div>
          <div style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif" }}>
            {doneLessons}/{lessons.length} complete
          </div>
        </div>
      </PageHeader>
      <div style={{ padding:"18px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif" }}>{doneLessons} of {lessons.length} complete</span>
          <XPBadge xp={lessons.reduce((a,l)=>a+l.xp,0)} color={color} />
        </div>
        <PBar value={lessons.length?(doneLessons/lessons.length)*100:0} color={color} height={5} />
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:18 }}>
          {lessons.map((lesson, i) => { const done = progress.completed.includes(lesson.id);
            const FREE_LESSONS = 3;
            const guestLocked = isGuest && !guestAllowed.includes(lesson.id);
            const planLocked  = !isGuest && (profile?.plan === "free") && (i >= FREE_LESSONS);
            const isLocked    = guestLocked || planLocked;
            return (
              <button key={lesson.id} onClick={() => go("lesson", lesson)}
                style={{ background:C.bg2, border:`1px solid ${done?`${color}40`:C.border}`, borderRadius:14, padding:"15px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left", position:"relative", overflow:"hidden", animation:`slideUp .3s ease ${i*.06}s both` }}>
                {done && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:color }} />}
                {isLocked && <div style={{ position:"absolute", inset:0, background:"rgba(8,10,16,0.55)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:16 }}><span style={{ fontSize:20 }}>🔒</span></div>}
                <div style={{ width:46, height:46, borderRadius:12, background:done?`${color}20`:C.bg3, border:`1px solid ${done?`${color}30`:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                  {done ? "✅" : lesson.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:done?color:C.white, fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                    {lesson.title}
                    {isLocked && <span style={{ fontSize:10, background:"#F5A62320", border:"1px solid #F5A62340", borderRadius:5, padding:"1px 5px", color:"#F5A623", fontFamily:"Barlow,sans-serif", fontWeight:700 }}>{guestLocked ? "🔒 Free" : "🔒 Pro"}</span>}
                  </div>
                  <div style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif", marginTop:2 }}>{lesson.duration} · +{lesson.xp} XP</div>
                </div>
                <span style={{ color:done?color:C.gray2, fontSize:18 }}>{done?"✓":">"}</span>
              </button>
            ); })}
        </div>
      </div>
    </div>
  ); }

// ─── LESSON ───────────────────────────────────────────────────────────────────

function LessonScreen({ go, lesson, progress, updateProgress, track }) {
  const [step, setStep]   = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [chosen, setChosen]   = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore]     = useState(0);
  const color = track?.color || C.amber;
  const content = lesson.content || [];
  const quiz    = lesson.quiz    || [];
  const isQuiz  = step >= content.length;
  const qi      = quizIdx;
  const q       = quiz[qi];

  const finishLesson = () => {
    if (!progress.completed.includes(lesson.id)) {
      updateProgress({ completed:[...progress.completed, lesson.id], xp:(progress.xp||0)+lesson.xp });
    }
    go("learn");
  };

  if (!isQuiz) {
    const block = content[step];
    return (
      <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
        <PageHeader title={lesson.title} subtitle={"STEP "+(step+1)+"/"+content.length} color={color} back onBack={()=>step>0?setStep(step-1):go("learn")} />
        <div style={{padding:"0 20px"}}>
          <PBar value={((step+1)/content.length)*100} color={color} height={4} />
          <div style={{marginTop:16}}>
            {block.type==="intro" && <div style={{background:C.bg2,border:"1px solid "+color+"30",borderLeft:"3px solid "+color,borderRadius:14,padding:18,marginBottom:14}}><div style={{color:color,fontSize:10,letterSpacing:2,fontFamily:"Barlow,sans-serif",fontWeight:700,marginBottom:8}}>OVERVIEW</div><div style={{color:C.offWhite,fontSize:15,fontFamily:"Barlow,sans-serif",lineHeight:1.7}}>{block.text}</div></div>}
            {block.type==="steps" && <div style={{background:C.bg2,borderRadius:14,padding:18,marginBottom:14}}><div style={{color:C.white,fontSize:15,fontWeight:700,marginBottom:14}}>{block.title}</div>{block.items.map((item,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}><div style={{width:24,height:24,borderRadius:"50%",background:color+"20",border:"1px solid "+color+"40",display:"flex",alignItems:"center",justifyContent:"center",color,fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div><div style={{color:C.offWhite,fontSize:13,fontFamily:"Barlow,sans-serif",lineHeight:1.6}}>{item}</div></div>)}</div>}
            {block.type==="tip" && <div style={{background:"linear-gradient(135deg,#1A1200,#111827)",border:"1px solid "+C.amberDim,borderRadius:14,padding:16,display:"flex",gap:12}}><span style={{fontSize:28,flexShrink:0}}>🧔🏿</span><div><div style={{color:C.amber,fontSize:11,fontWeight:700,marginBottom:4}}>BIG EARL SAYS</div><div style={{color:"#ddd",fontSize:13,fontFamily:"Barlow,sans-serif",lineHeight:1.6,fontStyle:"italic"}}>"{block.text}"</div></div></div>}
          </div>
          <div style={{display:"flex",gap:10,marginTop:20}}>
            {step>0&&<button onClick={()=>setStep(step-1)} style={{flex:1,background:C.bg2,border:"1px solid "+C.border,borderRadius:12,padding:14,color:C.gray2,fontSize:13,cursor:"pointer",fontFamily:"Barlow,sans-serif"}}>← Back</button>}
            <button onClick={()=>step<content.length-1?setStep(step+1):(quiz.length>0?setStep(content.length):finishLesson())} style={{flex:2,background:"linear-gradient(135deg,"+color+","+color+"cc)",border:"none",borderRadius:12,padding:14,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:1.5}}>
              {step<content.length-1?"NEXT →":quiz.length>0?"TAKE QUIZ →":"COMPLETE ✓"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>🎉</div>
      <div style={{color:color,fontSize:26,fontWeight:700,fontFamily:"Oswald,sans-serif",letterSpacing:2,marginBottom:8}}>LESSON COMPLETE!</div>
      <div style={{color:C.gray2,fontSize:14,fontFamily:"Barlow,sans-serif",marginBottom:8}}>Score: {score}/{quiz.length}</div>
      <XPBadge xp={lesson.xp} color={color} />
      <button onClick={finishLesson} style={{marginTop:24,background:"linear-gradient(135deg,"+color+","+color+"cc)",border:"none",borderRadius:14,padding:"16px 40px",color:"#000",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:2}}>BACK TO LESSONS</button>
    </div>
  );

  const correct = chosen===q.ans;
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title={"Q "+(qi+1)+"/"+quiz.length} subtitle="KNOWLEDGE CHECK" color={color} back onBack={()=>qi>0?(setQuizIdx(qi-1),setChosen(null),setShowExp(false)):setStep(content.length-1)} />
      <div style={{padding:"0 20px"}}>
        <PBar value={((qi+1)/quiz.length)*100} color={color} height={4} />
        <div style={{background:C.bg2,border:"1px solid "+color+"30",borderRadius:14,padding:18,marginTop:16,marginBottom:14}}><div style={{color:C.offWhite,fontSize:15,fontFamily:"Barlow,sans-serif",lineHeight:1.6}}>{q.q}</div></div>
        {q.opts.map((opt,i)=>{
          const isCorrect=i===q.ans, isChosen=chosen===i;
          const bg=chosen!==null?(isCorrect?"#10B98120":isChosen?"#EF535020":C.bg2):C.bg2;
          const bc=chosen!==null?(isCorrect?"#10B981":isChosen?"#EF5350":C.border):C.border;
          return <button key={i} onClick={()=>{if(chosen===null){setChosen(i);setShowExp(true);if(i===q.ans)setScore(s=>s+1);}}} style={{width:"100%",background:bg,border:"1px solid "+bc,borderRadius:10,padding:"13px 14px",cursor:"pointer",textAlign:"left",marginBottom:8,color:C.offWhite,fontSize:13,fontFamily:"Barlow,sans-serif",lineHeight:1.5}}>{opt}</button>;
        })}
        {showExp&&<><div style={{background:correct?"#10B98120":"#EF535020",border:"1px solid "+(correct?"#10B981":"#EF5350")+"40",borderRadius:12,padding:14,marginBottom:12}}><div style={{color:correct?"#10B981":"#EF5350",fontSize:12,fontWeight:700,marginBottom:4}}>{correct?"✓ CORRECT":"✗ INCORRECT"}</div><div style={{color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",lineHeight:1.5}}>{q.exp}</div></div><button onClick={()=>{setChosen(null);setShowExp(false);qi+1<quiz.length?setQuizIdx(qi+1):setQuizIdx(quiz.length);}} style={{width:"100%",background:color,border:"none",borderRadius:12,padding:14,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:1.5}}>{qi+1<quiz.length?"NEXT QUESTION →":"SEE RESULTS →"}</button></>}
      </div>
    </div>
  );
}

function SimListScreen({ go, track, progress }) {
  const [catFilter, setCatFilter] = useState("all");
  const [diff, setDiff]           = useState("all");
  const color     = track?.color || C.amber;
  const userTrackId = track ? track.id : "all";
  const cats      = ["all","Emergency","Road Skill","Compliance","Business"];
  const filtered  = SIMS.filter(s => {
    const trackMatch = s.track === "all" || s.track === userTrackId;
    const catMatch   = catFilter === "all" || s.category === catFilter;
    const diffMatch  = diff === "all" || s.difficulty === diff;
    return trackMatch && catMatch && diffMatch; });
  return (
    <div>
      <PageHeader title="Simulations" subtitle="REAL-WORLD SCENARIOS" color={color}>
        <div style={{ display:"flex", gap:8, marginTop:12, overflowX:"auto", paddingBottom:4 }}>
          {cats.map(f => (
            <button key={f} onClick={() => setCatFilter(f)} style={{
              background:catFilter===f?color+"20":C.bg3,
              border:"1px solid "+(catFilter===f?color:C.border),
              borderRadius:20, padding:"5px 12px", cursor:"pointer",
              whiteSpace:"nowrap", flexShrink:0,
              color:catFilter===f?color:C.gray2,
              fontSize:10, fontFamily:"Barlow,sans-serif", fontWeight:600,
            }}>
              {f==="all"?"All Categories":f}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, marginTop:8, overflowX:"auto" }}>
          {["all","Beginner","Intermediate","Expert"].map(d => (
            <button key={d} onClick={() => setDiff(d)} style={{
              background:diff===d?color+"20":C.bg3,
              border:"1px solid "+(diff===d?color:C.border),
              borderRadius:20, padding:"4px 10px", cursor:"pointer",
              whiteSpace:"nowrap", flexShrink:0,
              color:diff===d?color:C.gray2,
              fontSize:10, fontFamily:"Barlow,sans-serif", fontWeight:600,
            }}>
              {d==="all"?"All Levels":d}
            </button>
          ))}
        </div>
      </PageHeader>
      <div style={{ padding:"18px 24px" }}>
        <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif", marginBottom:16 }}>
          {filtered.length} scenarios · {Object.keys(progress.simScores||{}).length} completed
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(sim => {
            const simDone = progress.simScores?.[sim.id];
            const rc = simDone==="good"?C.green:simDone==="neutral"?C.amber:simDone==="bad"?"#EF5350":null;
            return (
              <button key={sim.id} onClick={() => go("simPlay", sim)} style={{
                background:C.bg2, border:"1px solid "+(rc?rc+"40":C.border),
                borderRadius:14, padding:"14px 16px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:14, textAlign:"left", width:"100%",
              }}>
                <div style={{ width:46, height:46, borderRadius:12, background:rc?rc+"15":color+"10", border:"1px solid "+(rc||color)+"30", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>
                  {sim.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:C.white, fontSize:13, fontWeight:600, fontFamily:"Barlow,sans-serif", marginBottom:4 }}>
                    {sim.title}
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <Tag label={sim.category} color={C.gray2} small />
                    <DifficultyTag level={sim.difficulty} />
                  </div>
                </div>
                <span style={{ color:rc||C.gray2, fontSize:18 }}>{rc?"✓":"›"}</span>
              </button> );
          })}
        </div>
      </div>
    </div> );
}

function VideoPlayer({ videoId, onEnded, onSkip, label, color }) {
  const isPlaceholder = !videoId || videoId.includes("_PLACEHOLDER_") || videoId.length < 8;

  if (isPlaceholder) {
    return (
      <div style={{ background:C.bg3, borderRadius:14, overflow:"hidden", marginBottom:16 }}>
        <div style={{ aspectRatio:"16/9", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, padding:20 }}>
          <div style={{ fontSize:40 }}>🎬</div>
          <div style={{ color:C.amber, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:600, textAlign:"center" }}>VIDEO COMING SOON</div>
          <div style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif", textAlign:"center", lineHeight:1.5 }}>Real dashcam footage for this scenario is being curated</div>
        </div>
        <button onClick={onSkip} style={{ width:"100%", padding:14, background:color+"20", border:"none", borderTop:"1px solid "+C.border, color, fontSize:12, fontWeight:600, letterSpacing:1.5, cursor:"pointer", fontFamily:"Oswald,sans-serif" }}>
          SEE OUTCOME ANYWAY
        </button>
      </div>
    ); }

  const isShort = videoId.length === 11; // all YouTube IDs are 11 chars
  const watchUrl = "https://www.youtube.com/watch?v=" + videoId;
  const thumbUrl = "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg";

  return (
    <div style={{ borderRadius:14, overflow:"hidden", marginBottom:16, background:"#000" }}>
      {/* Label bar */}
      <div style={{ background:color+"20", padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ color, fontSize:10, letterSpacing:2, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>{label}</div>
        <div style={{ color:C.gray2, fontSize:10, fontFamily:"Barlow,sans-serif" }}>▶ REAL FOOTAGE</div>
      </div>

      {/* Thumbnail with play button */}
      <div style={{ position:"relative" }}>
        <img
          src={thumbUrl} alt="video thumbnail" style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block" }}
        />
        {/* Dark overlay */}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }}/>
        {/* Red play button */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", }}>
          <div style={{ width:64, height:64, borderRadius:14, background:"rgba(255,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.5)", }}>
            <div style={{ width:0, height:0, borderTop:"12px solid transparent", borderBottom:"12px solid transparent", borderLeft:"22px solid #fff", marginLeft:5, }}/>
          </div>
        </div>
        {/* YouTube label */}
        <div style={{ position:"absolute", bottom:10, left:10, background:"rgba(0,0,0,0.75)", borderRadius:6, padding:"3px 8px", display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:16, height:11, background:"#FF0000", borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:"7px solid #fff", marginLeft:1 }}/>
          </div>
          <span style={{ color:"#fff", fontSize:9, fontFamily:"Barlow,sans-serif", fontWeight:600 }}>
            YOUTUBE
          </span>
        </div>
      </div>

      {/* Watch button */}
      <a href={watchUrl} target="_blank" rel="noopener noreferrer"
        style={{ display:"block", width:"100%", padding:13, background:"#FF0000", color:"#fff", fontSize:12, fontWeight:700, letterSpacing:1.5, cursor:"pointer",
          fontFamily:"Oswald,sans-serif", textAlign:"center", textDecoration:"none" }}> ▶ WATCH VIDEO
      </a>

      {/* Skip button */}
      <button onClick={onSkip} style={{ width:"100%", padding:11, background:color+"15", border:"none", borderTop:"1px solid "+C.border, color, fontSize:11, fontWeight:600, letterSpacing:1.5, cursor:"pointer", fontFamily:"Oswald,sans-serif" }}>
        SKIP - SEE OUTCOME
      </button>
    </div>
  ); }

function ScenarioPhoto({ photoUrl, label, color, onContinue }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);
  return (
    <div style={{ borderRadius:14, overflow:"hidden", marginBottom:16, border:"1px solid "+color+"40", background:"#050608" }}>
      {/* Label bar */}
      <div style={{ background:color+"20", padding:"8px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ color, fontSize:10, letterSpacing:2, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>{label}</div>
        <div style={{ color:C.gray2, fontSize:10, fontFamily:"Barlow,sans-serif" }}>
          REAL SCENARIO
        </div>
      </div>
      {/* Photo */}
      <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", background:C.bg3, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {!error ? (
          <img
            src={photoUrl} alt="scenario" onLoad={()=>setLoaded(true)} onError={()=>setError(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity:loaded?1:0, transition:"opacity .3s ease" }}
          /> ) : (
          <div style={{ fontSize:48, opacity:0.4 }}>🚛</div>
        )} {!loaded && !error && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:32, height:32, border:"3px solid "+color+"40", borderTop:"3px solid "+color, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
          </div>
        )}
      </div>
      {/* Continue button */}
      <button onClick={onContinue} style={{
        width:"100%", padding:14, background:"linear-gradient(135deg,"+color+","+color+"bb)",
        border:"none", color:"#000", fontSize:13, fontWeight:700, letterSpacing:2, cursor:"pointer", fontFamily:"Oswald,sans-serif",
      }}> SEE THE OUTCOME →
      </button>
    </div>
  ); }


function SimPlayScreen({ go, sim, progress, updateProgress }) {
  const [phase, setPhase]   = useState("read");   // read | choose | video | outcome
  const [chosen, setChosen] = useState(null);
  const vm = VIDEO_MAP[sim.id] || {};
  const outcome = chosen?.outcome || "good";
  const videoId = vm[outcome] || vm.good;

  const choose = (opt) => {
    setChosen(opt);
    setPhase(videoId ? "video" : "outcome");
  };

  const finish = () => {
    updateProgress({ simScores:{ ...progress.simScores, [sim.id]: outcome } });
    go("simList");
  };

  const color = outcome==="good"?C.green:outcome==="neutral"?C.amber:"#EF5350";

  if (phase==="read") return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title={sim.title} subtitle={sim.category.toUpperCase()} color={sim.color||C.amber} back onBack={()=>go("simList")} />
      <div style={{padding:"0 20px"}}>
        <div style={{background:C.bg2,border:"1px solid "+C.amber+"30",borderLeft:"3px solid "+C.amber,borderRadius:14,padding:18,marginBottom:16}}>
          <div style={{color:C.amber,fontSize:10,letterSpacing:2,fontFamily:"Barlow,sans-serif",fontWeight:700,marginBottom:10}}>THE SITUATION</div>
          <div style={{color:C.offWhite,fontSize:15,fontFamily:"Barlow,sans-serif",lineHeight:1.7}}>{sim.scenario}</div>
        </div>
        <div style={{color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",marginBottom:12,textAlign:"center"}}>What do you do?</div>
        {sim.options.map((opt,i)=>(
          <button key={i} onClick={()=>choose(opt)} style={{width:"100%",background:C.bg2,border:"1px solid "+C.border,borderRadius:12,padding:"16px 18px",cursor:"pointer",textAlign:"left",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:C.amber+"20",border:"1px solid "+C.amber+"40",display:"flex",alignItems:"center",justifyContent:"center",color:C.amber,fontSize:14,fontWeight:700,flexShrink:0}}>{String.fromCharCode(65+i)}</div>
            <div style={{color:C.offWhite,fontSize:13,fontFamily:"Barlow,sans-serif",lineHeight:1.5}}>{opt.text}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase==="video") return (
    <div style={{background:"#000",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{background:color+"20",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:chosen.text,display:"none"}}/>
        <div style={{color:color,fontSize:10,letterSpacing:2,fontFamily:"Barlow,sans-serif",fontWeight:700}}>{outcome==="good"?"CORRECT RESPONSE":"WHAT HAPPENS"} - WATCH WHAT HAPPENS</div>
        <div style={{color:C.gray2,fontSize:10,fontFamily:"Barlow,sans-serif"}}>▶ REAL FOOTAGE</div>
      </div>
      <VideoPlayer videoId={videoId} onSkip={()=>setPhase("outcome")} label="WATCH WHAT HAPPENS" color={color} />
      <div style={{padding:"0 20px"}}>
        <div style={{color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",marginBottom:10}}>You chose: <span style={{color:color}}>"{chosen.text}"</span></div>
        <button onClick={()=>setPhase("outcome")} style={{width:"100%",background:color+"15",border:"1px solid "+color+"40",borderRadius:12,padding:14,color,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:1.5}}>SKIP - SEE OUTCOME →</button>
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title="Outcome" subtitle={sim.category.toUpperCase()} color={color} back onBack={()=>go("simList")} />
      <div style={{padding:"0 20px"}}>
        <div style={{textAlign:"center",padding:"24px 0 20px"}}>
          <div style={{fontSize:60,marginBottom:8}}>{outcome==="good"?"✅":outcome==="neutral"?"⚠️":"❌"}</div>
          <div style={{color:color,fontSize:22,fontWeight:700,fontFamily:"Oswald,sans-serif",letterSpacing:2}}>{outcome==="good"?"CORRECT":"WRONG CALL"}</div>
          <div style={{color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",marginTop:4}}>You chose: "{chosen?.text}"</div>
        </div>
        <div style={{background:C.bg2,border:"1px solid "+color+"30",borderLeft:"3px solid "+color,borderRadius:14,padding:18,marginBottom:16}}>
          <div style={{color:color,fontSize:10,letterSpacing:2,fontFamily:"Barlow,sans-serif",fontWeight:700,marginBottom:8}}>WHAT SHOULD HAPPEN</div>
          <div style={{color:C.offWhite,fontSize:14,fontFamily:"Barlow,sans-serif",lineHeight:1.7}}>{chosen?.detail||sim.options.find(o=>o.outcome==="good")?.detail}</div>
        </div>
        <div style={{background:"linear-gradient(135deg,#1A1200,#0D1117)",border:"1px solid "+C.amberDim,borderRadius:14,padding:16,marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:24,flexShrink:0}}>🧔🏿</span>
          <div>
            <div style={{color:C.amber,fontSize:11,fontFamily:"Barlow,sans-serif",fontWeight:700,marginBottom:4}}>BIG EARL SAYS</div>
            <div style={{color:"#ddd",fontSize:12,fontFamily:"Barlow,sans-serif",lineHeight:1.6,fontStyle:"italic"}}>"{sim.earlTip||"Every situation on the road has a right answer. Know it before you need it."}"</div>
          </div>
        </div>
        <button onClick={finish} style={{width:"100%",background:"linear-gradient(135deg,"+C.amber+",#F97316)",border:"none",borderRadius:14,padding:16,color:"#000",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:2}}>NEXT SCENARIO →</button>
      </div>
    </div>
  );
}


function CDLScreen({ go, progress, updateProgress, profile }) {
  const [selState, setSelState] = useState(profile?.state||"Texas");
  const [mode, setMode]         = useState("menu");
  const CATS = ["General Knowledge","Air Brakes","Combination","Road Signs","Hazmat"];
  const stateQs = STATE_Q[selState] || [];
  const allQ = [...CDL_QUESTIONS, ...stateQs];
  const missed = allQ.filter(q => progress.missedQuestions?.includes(q.id));
  const bookmarked = allQ.filter(q => progress.bookmarked?.includes(q.id));
  const weakAreas = progress.weakAreas || {};

  const startQuiz = (questions, label) => go("cdlTest", { questions, label });

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title="CDL Prep" subtitle="KNOWLEDGE TESTS" color={C.blue} />
      <div style={{padding:"0 16px"}}>
        <div style={{background:C.bg2,borderRadius:12,padding:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",flexShrink:0}}>State:</span>
          <select value={selState} onChange={e=>setSelState(e.target.value)} style={{flex:1,background:C.bg3,border:"1px solid "+C.border,borderRadius:8,padding:"8px 10px",color:C.white,fontSize:13,fontFamily:"Barlow,sans-serif",outline:"none"}}>
            {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{color:C.gray2,fontSize:10,letterSpacing:2,fontFamily:"Barlow,sans-serif",marginBottom:10,fontWeight:700}}>PRACTICE BY CATEGORY</div>
        {CATS.map(cat=>{
          const qs = CDL_QUESTIONS.filter(q=>q.cat===cat);
          const done = qs.filter(q=>progress.cdlScores?.[q.id]!==undefined).length;
          return (
            <button key={cat} onClick={()=>startQuiz(qs,cat)} style={{width:"100%",background:C.bg2,border:"1px solid "+C.border,borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,textAlign:"left"}}>
              <div>
                <div style={{color:C.white,fontSize:13,fontFamily:"Barlow,sans-serif",fontWeight:600}}>{cat}</div>
                <div style={{color:C.gray2,fontSize:11,fontFamily:"Barlow,sans-serif"}}>{qs.length} questions · {done} done</div>
              </div>
              <span style={{color:C.blue,fontSize:18}}>›</span>
            </button>
          );
        })}
        {stateQs.length>0&&<button onClick={()=>startQuiz(stateQs,selState+" Specific")} style={{width:"100%",background:C.blue+"15",border:"1px solid "+C.blue+"40",borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,textAlign:"left"}}><div><div style={{color:C.blue,fontSize:13,fontFamily:"Barlow,sans-serif",fontWeight:700}}>{selState} Specific</div><div style={{color:C.gray2,fontSize:11,fontFamily:"Barlow,sans-serif"}}>{stateQs.length} questions</div></div><span style={{color:C.blue,fontSize:18}}>›</span></button>}
        {missed.length>0&&<button onClick={()=>startQuiz(missed,"Missed Questions")} style={{width:"100%",background:"#EF535015",border:"1px solid #EF535040",borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,textAlign:"left"}}><div><div style={{color:"#EF5350",fontSize:13,fontFamily:"Barlow,sans-serif",fontWeight:700}}>⚠️ Missed Questions</div><div style={{color:C.gray2,fontSize:11,fontFamily:"Barlow,sans-serif"}}>{missed.length} to review</div></div><span style={{color:"#EF5350",fontSize:18}}>›</span></button>}
        <button onClick={()=>startQuiz(allQ.sort(()=>Math.random()-0.5).slice(0,25),"Random Mix")} style={{width:"100%",background:"linear-gradient(135deg,"+C.blue+"20,"+C.blue+"10)",border:"1px solid "+C.blue+"30",borderRadius:12,padding:"13px 16px",cursor:"pointer",textAlign:"center",marginBottom:8}}>
          <div style={{color:C.blue,fontSize:13,fontWeight:700,fontFamily:"Oswald,sans-serif",letterSpacing:1}}>🎲 RANDOM 25-QUESTION MIX</div>
        </button>
      </div>
    </div>
  );
}

function CDLTestScreen({ go, data, setProgress, progress }) {
  const { cat, mode, stateQs, stateName } = data || {};
  const bookmarked = progress?.bookmarked || [];
  const missed = progress?.missedQuestions || [];
  const baseQ = cat==="missed" ? missed :
                cat==="bookmarked" ? bookmarked : cat==="all" ? Object.values(CDL_Q).flat().sort(()=>Math.random()-.5) :
                cat==="state" ? (stateQs||[]) : (CDL_Q[cat]||[]).map(q=>({...q})); const allQ = baseQ;
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [bookmarks, setBookmarks] = useState(new Set((progress?.bookmarked||[]).map(q=>q.q)));
  const toggleBookmark = (q) => {
    const newBm = new Set(bookmarks);
    if(newBm.has(q.q)) { newBm.delete(q.q); } else { newBm.add(q.q); } setBookmarks(newBm);
    setProgress(p => { const existing = (p.bookmarked||[]).filter(bq => bq.q !== q.q);
      if(!bookmarks.has(q.q)) return {...p, bookmarked:[...existing, q]}; return {...p, bookmarked:existing};
    }); }; if (!allQ.length) return null; const q = allQ[current];
  const picked = answers[current];
  const totalQ = allQ.length;
  const submit = () => {
    const correct = allQ.filter((q,i)=>answers[i]===q.ans).length;
    const pct = Math.round((correct/totalQ)*100);
    const score = { cat, mode, correct, total:totalQ, pct, date:new Date().toLocaleDateString() };
    const newMissed = allQ.filter((q,i)=>answers[i]!==q.ans);
    setProgress(p => ({ ...p, cdlScores:[...(p.cdlScores||[]), score],
      missedQuestions: [...(p.missedQuestions||[]).filter(mq=>!newMissed.find(q=>q.q===mq.q)), ...newMissed],
    })); go("cdlResults", score); };
  const next = () => { if (current < totalQ-1) setCurrent(c=>c+1); else submit(); };
  const catLabel = {general:"General Knowledge",airbrakes:"Air Brakes",combination:"Combination Vehicles",roadsigns:"Road Signs",hazmat:"Hazardous Materials",all:"Full Practice Exam"}[cat]||cat;
  return (
    <div>
      <PageHeader title={catLabel} subtitle="CDL PREP" color={C.amber} back="CDL Prep" onBack={()=>go("cdl")}>
        <div style={{ marginTop:10, display:"flex", justifyContent:"space-between" }}>
          <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif" }}>Question {current+1} of {totalQ}</div>
          <div style={{ color:C.amber, fontSize:12, fontFamily:"Barlow,sans-serif", fontWeight:600 }}>{Object.keys(answers).length}/{totalQ} answered</div>
        </div>
        <div style={{ marginTop:8 }}><PBar value={((current+1)/totalQ)*100} color={C.amber} height={4} /></div>
      </PageHeader>
      <div style={{ padding:"18px 24px" }}>
        <Card style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:10 }}>
            <div style={{ color:C.white, fontSize:14, fontFamily:"Barlow,sans-serif", fontWeight:500, lineHeight:1.65, flex:1 }}>{q.q}</div>
            <button onClick={()=>toggleBookmark(q)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, flexShrink:0, padding:0, opacity:bookmarks.has(q.q)?1:0.35 }} title="Bookmark this question">
              {bookmarks.has(q.q)?"🔖":"🏷️"}
            </button>
          </div>
          {q.opts.map((opt, j) => { const chosen = picked===j; const correct = q.ans===j; const revealed = mode==="practice" && chosen;
            let bg=C.bg3, border=C.border2, tc=C.offWhite;
            if (revealed && correct)       { bg=`${C.green}15`; border=C.green; tc=C.green; }
            else if (revealed && !correct) { bg=`${C.red}15`; border=C.red; tc=C.red; }
            else if (chosen)               { bg=`${C.amber}15`; border=C.amber; tc=C.amber; }
            return (
              <button key={j} onClick={()=>setAnswers(a=>({...a,[current]:j}))}
                style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"11px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, textAlign:"left", marginBottom:8, width:"100%" }}>
                <div style={{ width:27, height:27, borderRadius:"50%", background:chosen?(revealed?(correct?C.green:C.red):C.amber):C.bg2, display:"flex", alignItems:"center", justifyContent:"center", color:chosen?"#000":C.gray2, fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {["A","B","C","D"][j]}
                </div>
                <div style={{ color:tc, fontSize:13, fontFamily:"Barlow,sans-serif" }}>{opt}</div>
              </button>
            ); })} {mode==="practice" && picked!==undefined && (
            <div style={{ marginTop:10, background:picked===q.ans?`${C.green}10`:`${C.red}10`, borderRadius:10, padding:"11px 14px", animation:"fadeIn .2s ease" }}>
              <div style={{ color:picked===q.ans?C.green:C.red, fontSize:10, fontFamily:"Barlow,sans-serif", fontWeight:700, letterSpacing:1.5, marginBottom:4 }}>{picked===q.ans?"CORRECT":"INCORRECT"}</div>
              <div style={{ color:C.offWhite, fontSize:12, fontFamily:"Barlow,sans-serif", lineHeight:1.6 }}>{q.exp}</div>
            </div>
          )}
        </Card>
        <div style={{ display:"flex", gap:10 }}>
          {current > 0 && <button onClick={()=>setCurrent(c=>c-1)} style={{ flex:1, padding:13, background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, color:C.gray1, fontSize:12, letterSpacing:1, cursor:"pointer", fontFamily:"Oswald,sans-serif" }}>PREV</button>}
          {picked !== undefined && <button onClick={next} style={{ flex:2, padding:13, background:`linear-gradient(135deg,${C.amber},#FF8A00)`, border:"none", borderRadius:12, color:"#000", fontSize:13, fontWeight:700, letterSpacing:2, cursor:"pointer" }}>{current===totalQ-1?"SUBMIT EXAM":"NEXT"}</button>}
        </div>
      </div>
    </div>
  ); }

// ─── CDL RESULTS ──────────────────────────────────────────────────────────────
function CDLResultsScreen({ go, data }) {
  const { correct=0, total=1, pct=0 } = data || {};
  const passed = pct >= 80;
  return (
    <div>
      <PageHeader title="Exam Complete" subtitle="YOUR SCORE" color={passed?C.green:C.red} />
      <div style={{ padding:"28px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:64, marginBottom:12 }}>{passed?"🎉":"📚"}</div>
          <div style={{ color:passed?C.green:C.red, fontSize:56, fontWeight:700, lineHeight:1 }}>{pct}%</div>
          <div style={{ color:passed?C.green:C.red, fontSize:18, fontWeight:600, marginTop:6 }}>{passed?"PASSED!":"KEEP STUDYING"}</div>
          <div style={{ color:C.gray2, fontSize:13, fontFamily:"Barlow,sans-serif", marginTop:8 }}>{correct} correct out of {total} · Passing score: 80%</div>
        </div>
        <Card style={{ marginBottom:18, padding:16 }}>
          <PBar value={pct} color={passed?C.green:C.red} height={10} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
            <span style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif" }}>0%</span>
            <span style={{ color:C.amber, fontSize:11, fontFamily:"Barlow,sans-serif" }}>Pass: 80%</span>
            <span style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif" }}>100%</span>
          </div>
        </Card>
        {!passed && (
          <div style={{ background:`${C.amber}10`, border:`1px solid ${C.amberDim}`, borderRadius:14, padding:16, marginBottom:18 }}>
            <div style={{ color:C.amber, fontSize:13, fontWeight:600, marginBottom:8 }}>Study Plan</div>
            <div style={{ color:C.offWhite, fontSize:12, fontFamily:"Barlow,sans-serif", lineHeight:1.7 }}>Review lesson content in the Learn section. Retake practice tests by category to isolate weak areas. Aim for 90%+ on practice before attempting full exam mode again.</div>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={()=>go("cdlTest",data)} style={{ width:"100%", padding:14, background:`linear-gradient(135deg,${C.amber},#FF8A00)`, border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:700, letterSpacing:2, cursor:"pointer" }}>TRY AGAIN</button>
          <button onClick={()=>go("cdl")} style={{ width:"100%", padding:14, background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, color:C.gray1, fontSize:14, letterSpacing:2, cursor:"pointer", fontFamily:"Oswald,sans-serif" }}>BACK TO CDL PREP</button>
        </div>
      </div>
    </div>
  ); }

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

function ProgressScreen({ go, progress, track }) {
  const color = track?.color || C.amber;
  const lessons = LESSONS[track?.id||"beginner"] || [];
  const done = progress.completed.length;
  const simsDone = Object.keys(progress.simScores||{}).length;
  const cdlDone  = Object.keys(progress.cdlScores||{}).length;
  const stats = [
    {icon:"📚",label:"Lessons Done",val:done,total:lessons.length,color:C.blue},
    {icon:"🎮",label:"Sims Played",val:simsDone,total:20,color:C.green},
    {icon:"📋",label:"CDL Questions",val:cdlDone,total:50,color:C.amber},
    {icon:"⭐",label:"XP Earned",val:progress.xp||0,total:null,color:"#A78BFA"},
    {icon:"🔥",label:"Day Streak",val:progress.streak||0,total:null,color:"#F97316"},
  ];
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title="My Progress" subtitle="DRIVER STATS" color={color} back onBack={()=>go("profile")} />
      <div style={{padding:"0 16px"}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:"1px solid "+s.color+"25",borderRadius:14,padding:16,marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:12,background:s.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{s.icon}</div>
            <div style={{flex:1}}>
              <div style={{color:C.gray2,fontSize:11,fontFamily:"Barlow,sans-serif",marginBottom:4}}>{s.label}</div>
              <div style={{color:s.color,fontSize:22,fontWeight:700,fontFamily:"Oswald,sans-serif"}}>
                {s.val}{s.total?<span style={{color:C.gray2,fontSize:14}}>/{s.total}</span>:null}
              </div>
              {s.total&&<PBar value={(s.val/s.total)*100} color={s.color} height={4} />}
            </div>
          </div>
        ))}
        {(progress.weakAreas&&Object.keys(progress.weakAreas).length>0)&&(
          <div style={{background:C.bg2,border:"1px solid #EF535030",borderRadius:14,padding:16,marginTop:4}}>
            <div style={{color:"#EF5350",fontSize:11,fontFamily:"Barlow,sans-serif",fontWeight:700,marginBottom:10,letterSpacing:1.5}}>WEAK AREAS - FOCUS HERE</div>
            {Object.entries(progress.weakAreas).slice(0,5).map(([cat,count])=>(
              <div key={cat} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:C.offWhite,fontSize:12,fontFamily:"Barlow,sans-serif"}}>{cat}</span>
                <span style={{color:"#EF5350",fontSize:12,fontFamily:"Barlow,sans-serif"}}>{count} missed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResourcesScreen({ go }) {
  return (
    <div>
      <PageHeader title="Resources" subtitle="TRUCKING KNOWLEDGE BASE" color={C.blue} />
      <div style={{ padding:"18px 24px" }}>
        {[
          { icon:"📖", label:"Trucking Glossary", desc:`${GLOSSARY.length} essential terms defined`, screen:"glossary", color:C.amber },
          { icon:"💡", label:"Pro Tips", desc:"Real-world advice from veteran drivers", screen:"tips", color:C.green },
          { icon:"📰", label:"Industry News", desc:"Latest trucking regulations and market news", screen:"news", color:C.blue },
        ].map((item, i) => (
          <button key={i} onClick={() => go(item.screen)}
            style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left", marginBottom:12, width:"100%", position:"relative", overflow:"hidden", animation:`slideUp .3s ease ${i*.08}s both` }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:item.color }} />
            <div style={{ width:48, height:48, borderRadius:12, background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:item.color, fontSize:15, fontWeight:600 }}>{item.label}</div>
              <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif", marginTop:2 }}>{item.desc}</div>
            </div>
            <span style={{ color:item.color, fontSize:16 }}>{">"}</span>
          </button>
        ))}
      </div>
    </div>
  ); }

function GlossaryScreen({ go }) {
  const TERMS = [
    {t:"BOL", d:"Bill of Lading - legal document between shipper and carrier listing cargo details."},
    {t:"CPM", d:"Cost Per Mile - total operating expenses divided by miles driven."},
    {t:"CSA", d:"Compliance, Safety, Accountability - FMCSA scoring system for carriers and drivers."},
    {t:"DAT", d:"Largest freight load board in North America with 400M+ loads annually."},
    {t:"DOT", d:"Department of Transportation - oversees transportation safety regulations."},
    {t:"DPF", d:"Diesel Particulate Filter - emission control device requiring periodic cleaning."},
    {t:"ELD", d:"Electronic Logging Device - mandatory device tracking HOS automatically."},
    {t:"FMCSA", d:"Federal Motor Carrier Safety Administration - regulates commercial trucking."},
    {t:"HOS", d:"Hours of Service - federal rules limiting driving and on-duty hours."},
    {t:"IFTA", d:"International Fuel Tax Agreement - simplifies fuel tax reporting across states."},
    {t:"Per Diem", d:"IRS daily meal allowance of $80 for truck drivers away from home."},
    {t:"RPM", d:"Rate Per Mile - gross revenue divided by total miles on a load."},
    {t:"WLL", d:"Working Load Limit - maximum load a tie-down device can secure safely."},
  ];
  const [search, setSearch] = useState("");
  const filtered = TERMS.filter(t => t.t.toLowerCase().includes(search.toLowerCase()) || t.d.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingBottom:100 }}>
      <PageHeader title="Glossary" subtitle="CDL TERMS" color={C.blue} back onBack={()=>go("resources")} />
      <div style={{ padding:"0 16px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search terms..." style={{ width:"100%", background:C.bg2, border:"1px solid "+C.border, borderRadius:10, padding:"10px 14px", color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", marginBottom:14, boxSizing:"border-box", outline:"none" }} />
        {filtered.map(item => (
          <div key={item.t} style={{ background:C.bg2, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
            <div style={{ color:C.amber, fontSize:13, fontWeight:700, fontFamily:"Oswald,sans-serif", marginBottom:4 }}>{item.t}</div>
            <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif", lineHeight:1.5 }}>{item.d}</div>
          </div>
        ))}
      </div>
    </div> );
}

function TipsScreen({ go }) {
  const TIPS = [
    {icon:"💰", title:"Always counter broker rates", tip:"Brokers offer low. Always counter 10-15% higher. Worst they can say is no."},
    {icon:"⏰", title:"The 14-hour clock never stops", tip:"Once your clock starts, it runs straight through. Plan your day around 14 hours, not 11."},
    {icon:"🔍", title:"Tug test every single time", tip:"Visual confirmation plus tug test. Never assume you are coupled."},
    {icon:"⛽", title:"Fuel in low-tax states", tip:"Texas and New Jersey diesel is cheaper than California and Pennsylvania. Plan your fill-ups."},
    {icon:"📋", title:"Check broker credit before hauling", tip:"DAT and Truckstop show broker payment history. Never haul for a broker with red flags."},
    {icon:"🛑", title:"Air brake warning means stop now", tip:"When the buzzer hits at 60 PSI, find a safe place immediately. Spring brakes will lock."},
    {icon:"🌧️", title:"Reduce speed before bad weather hits", tip:"Slow down before you hit rain or ice, not after. Reaction time at 65 mph is too long."},
    {icon:"💪", title:"Take the rest break", tip:"A 30-minute break after 8 hours is required. Use it. Fatigue is the #1 accident cause."},
  ];
  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingBottom:100 }}>
      <PageHeader title="Pro Tips" subtitle="BIG EARL'S BEST" color={C.amber} back onBack={()=>go("resources")} />
      <div style={{ padding:"0 16px" }}>
        {TIPS.map((tip,i) => (
          <div key={i} style={{ background:C.bg2, border:"1px solid "+C.amber+"20", borderRadius:12, padding:14, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <span style={{ fontSize:22 }}>{tip.icon}</span>
              <div style={{ color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>{tip.title}</div>
            </div>
            <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif", lineHeight:1.6 }}>{tip.tip}</div>
          </div>
        ))}
      </div>
    </div> );
}

function NewsScreen({ go }) {
  const [tab, setTab] = useState("feed");
  const HEADLINES = [
    { id:1, cat:"Regulations", title:"FMCSA Proposes New ELD Exemption Rules", time:"2h ago", color:C.amber },
    { id:2, cat:"Fuel", title:"Diesel Prices Drop 8 Cents Nationally", time:"4h ago", color:"#10B981" },
    { id:3, cat:"Weather", title:"Winter Storm Warning: I-80 Wyoming Corridor", time:"6h ago", color:"#60A5FA" },
    { id:4, cat:"FMCSA", title:"CSA Scoring Updates Take Effect Next Month", time:"1d ago", color:C.blue },
    { id:5, cat:"Business", title:"Load Board Rates Up 12% in Midwest Lanes", time:"1d ago", color:C.green },
    { id:6, cat:"Industry", title:"Truck Driver Shortage Hits Record High", time:"2d ago", color:C.gray2 },
  ];
  const EARL_DIGEST = [
    { icon:"📋", title:"On the ELD Exemption", text:"They are talking about exempting short-haul drivers from ELD. Good. Paper logs work fine for local runs and the device cost is killing small fleets." },
    { icon:"⛽", title:"On Diesel Prices", text:"Eight cents sounds small. On 150,000 miles a year getting 6 MPG that is 25,000 gallons. Eight cents a gallon is $2,000 back in your pocket. Pay attention to fuel prices." },
    { icon:"❄️", title:"On Winter Driving", text:"I-80 through Wyoming in winter is not a suggestion. When they say chains required they mean it. No load is worth your life or your truck." },
  ];
  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingBottom:100 }}>
      <PageHeader title="Industry News" subtitle="TRUCKING UPDATES" color={C.blue}>
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          {["feed","earl"].map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?C.blue+"20":C.bg3, border:"1px solid "+(tab===t?C.blue:C.border), borderRadius:20, padding:"5px 14px", cursor:"pointer", color:tab===t?C.blue:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif", fontWeight:600 }}>
              {t==="feed"?"📡 Live Feed":"🧔🏿 Earl's Digest"}
            </button>
          ))}
        </div>
      </PageHeader>
      <div style={{ padding:"0 16px" }}>
        {tab==="feed" ? HEADLINES.map(h => (
          <div key={h.id} style={{ background:C.bg2, borderLeft:"3px solid "+h.color, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ background:h.color+"20", color:h.color, fontSize:9, fontFamily:"Barlow,sans-serif", fontWeight:700, padding:"2px 8px", borderRadius:10 }}>{h.cat}</span>
              <span style={{ color:C.gray2, fontSize:10, fontFamily:"Barlow,sans-serif" }}>{h.time}</span>
            </div>
            <div style={{ color:C.offWhite, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:600, lineHeight:1.4 }}>{h.title}</div>
          </div>
        )) : EARL_DIGEST.map((e,i) => (
          <div key={i} style={{ background:C.bg2, border:"1px solid "+C.amber+"30", borderRadius:12, padding:14, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{e.icon}</span>
              <div style={{ color:C.amber, fontSize:12, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>{e.title}</div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:24, flexShrink:0 }}>🧔🏿</span>
              <div style={{ color:"#ddd", fontSize:12, fontFamily:"Barlow,sans-serif", lineHeight:1.6, fontStyle:"italic" }}>"{e.text}"</div>
            </div>
          </div>
        ))}
      </div>
    </div> );
}

function FeedbackScreen({ go }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const CATS = ["Lessons","Simulations","Pre-Trip Trainer","CDL Prep","Tools","Big Earl","UI/Design","Other"];
  if (submitted) return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, padding:40 }}>
      <div style={{ fontSize:60 }}>🙏</div>
      <div style={{ color:C.white, fontSize:22, fontWeight:700, fontFamily:"Oswald,sans-serif", textAlign:"center" }}>THANK YOU!</div>
      <div style={{ color:C.gray2, fontSize:14, fontFamily:"Barlow,sans-serif", textAlign:"center", lineHeight:1.6 }}>Your feedback helps make StreetSmart better for every driver on the road.</div>
      <button onClick={()=>go("home")} style={{ background:C.amber, border:"none", borderRadius:12, padding:"14px 32px", color:"#000", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Oswald,sans-serif", letterSpacing:1.5, marginTop:8 }}>BACK TO HOME</button>
    </div> );
  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingBottom:100 }}>
      <PageHeader title="Give Feedback" subtitle="HELP US IMPROVE" color={C.amber} back onBack={()=>go("home")} />
      <div style={{ padding:"0 20px" }}>
        <div style={{ background:C.bg2, borderRadius:14, padding:20, marginBottom:16 }}>
          <div style={{ color:C.white, fontSize:14, fontFamily:"Barlow,sans-serif", fontWeight:700, marginBottom:14 }}>Rate StreetSmart For Truckers</div>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:8 }}>
            {[1,2,3,4,5].map(s => <button key={s} onClick={()=>setRating(s)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:36 }}>{s<=rating?"⭐":"☆"}</button>)}
          </div>
        </div>
        <div style={{ background:C.bg2, borderRadius:14, padding:16, marginBottom:16 }}>
          <div style={{ color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:600, marginBottom:10 }}>What are you rating?</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {CATS.map(c => <button key={c} onClick={()=>setCategory(c)} style={{ background:category===c?C.amber+"25":C.bg3, border:"1px solid "+(category===c?C.amber:C.border), borderRadius:20, padding:"5px 12px", cursor:"pointer", color:category===c?C.amber:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif" }}>{c}</button>)}
          </div>
        </div>
        <div style={{ background:C.bg2, borderRadius:14, padding:16, marginBottom:20 }}>
          <div style={{ color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:600, marginBottom:10 }}>Tell us more (optional)</div>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="What can we improve?" style={{ width:"100%", background:C.bg3, border:"1px solid "+C.border, borderRadius:10, padding:12, color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", minHeight:80, resize:"none", boxSizing:"border-box" }} />
        </div>
        <button onClick={()=>{ if(rating>0) setSubmitted(true); }} style={{ width:"100%", background:rating>0?"linear-gradient(135deg,"+C.amber+",#F97316)":"#333", border:"none", borderRadius:14, padding:16, color:rating>0?"#000":C.gray2, fontSize:14, fontWeight:700, cursor:rating>0?"pointer":"default", fontFamily:"Oswald,sans-serif", letterSpacing:2 }}>
          {rating>0?"SUBMIT FEEDBACK":"SELECT A RATING FIRST"}
        </button>
      </div>
    </div> );
}

function ProfileScreen({ go, profile, setProfile, progress, track, setTrack, authUser, syncStatus }) {
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal]   = useState(profile.name);
  const currentPlan = PLANS.find(p=>p.id===profile.plan) || PLANS[0];
  const activeTrack = track || TRACKS[0];
  return (
    <div>
      <PageHeader title="Profile" subtitle="YOUR ACCOUNT AND SUBSCRIPTION" color={C.amber} />
      <div style={{ padding:"18px 24px" }}>
        {/* User card */}
        <Card style={{ marginBottom:18, padding:20 }}>
          <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:C.bg3, border:`2px solid ${C.amber}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🧑‍✈️</div>
            <div style={{ flex:1 }}>
              {editName ? (
                <input value={nameVal} onChange={e=>setNameVal(e.target.value)} onBlur={()=>{setProfile(p=>({...p,name:nameVal}));setEditName(false);}} autoFocus
                  style={{ background:C.bg3, border:`1px solid ${C.amber}`, borderRadius:8, padding:"6px 10px", color:C.white, fontSize:18, fontFamily:"Oswald,sans-serif", width:"100%", outline:"none", marginBottom:6 }} />
              ) : (
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                  <div style={{ color:C.white, fontSize:18, fontWeight:700 }}>{profile.name}</div>
                  <button onClick={()=>setEditName(true)} style={{ background:"none", border:"none", color:C.amber, fontSize:11, cursor:"pointer", fontFamily:"Barlow,sans-serif" }}>edit</button>
                </div>
              )}
              <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif" }}>Path: {activeTrack.label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                <span style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif" }}>Plan:</span>
                <span style={{ color:currentPlan.color, fontSize:13, fontWeight:700 }}>{currentPlan.name.toUpperCase()}</span>
              </div>
            </div>
          </div>
          {/* Quick stats */}
          <div style={{ display:"flex", borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            {[["📚",progress.completed.length,"LESSONS"],["🎮",Object.keys(progress.simScores).length,"SIMS"],["⭐",progress.xp,"XP"]].map(([icon,val,label],i)=>(
              <div key={i} style={{ flex:1, textAlign:"center", borderRight:i<2?`1px solid ${C.border}`:"none" }}>
                <div style={{ fontSize:18 }}>{icon}</div>
                <div style={{ color:C.amber, fontSize:18, fontWeight:700 }}>{val}</div>
                <div style={{ color:C.gray2, fontSize:9, letterSpacing:1.5, fontFamily:"Barlow,sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Change path */}
        <div style={{ color:C.gray2, fontSize:10, letterSpacing:3, fontFamily:"Barlow,sans-serif", marginBottom:10 }}>CHANGE YOUR PATH</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:22 }}>
          {TRACKS.map(t => (
            <button key={t.id} onClick={() => setTrack(t)}
              style={{ background:activeTrack.id===t.id?`${t.color}20`:C.bg2, border:`1px solid ${activeTrack.id===t.id?t.color:C.border}`, borderRadius:12, padding:"12px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:22 }}>{t.icon}</div>
              <div style={{ color:activeTrack.id===t.id?t.color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif", fontWeight:600 }}>{t.short}</div>
            </button>
          ))}
        </div>

        {/* Plans */}
        <div style={{ color:C.gray2, fontSize:10, letterSpacing:3, fontFamily:"Barlow,sans-serif", marginBottom:12 }}>SUBSCRIPTION PLANS</div>
        {PLANS.map(plan => { const active = profile.plan===plan.id; return (
            <div key={plan.id} style={{ background:active?`${plan.color}08`:C.bg2, border:`1px solid ${active?`${plan.color}40`:C.border}`, borderRadius:16, padding:18, marginBottom:12, position:"relative" }}>
              {plan.badge && (
                <div style={{ marginBottom:8 }}>
                  <Tag label={plan.badge} color={plan.color} small />
                </div>
              )}
              <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:12 }}>
                <div style={{ color:active?plan.color:C.white, fontSize:18, fontWeight:700 }}>{plan.name.toUpperCase()}</div>
                {active && <Tag label="ACTIVE" color={plan.color} small />}
                <div style={{ marginLeft:"auto", color:active?plan.color:C.gray1, fontSize:16, fontWeight:700 }}>{plan.price}<span style={{ fontSize:11, color:C.gray2 }}>{plan.period}</span></div>
              </div>
              {plan.features.map((f,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                  <div style={{ color:plan.color, fontSize:12, flexShrink:0 }}>✓</div>
                  <div style={{ color:C.offWhite, fontSize:12, fontFamily:"Barlow,sans-serif" }}>{f}</div>
                </div>
              ))} {!active && (
                <button onClick={()=>setProfile(p=>({...p,plan:plan.id}))} style={{ width:"100%", marginTop:12, padding:"10px", background:`${plan.color}20`, border:`1px solid ${plan.color}40`, borderRadius:10, color:plan.color, fontSize:12, fontWeight:600, letterSpacing:1, cursor:"pointer", fontFamily:"Barlow,sans-serif" }}>
                  SELECT PLAN
                </button>
              )}
            </div>
          ); })}
      </div>
    </div>
  ); }

// ─── BOOKMARKS SCREEN ─────────────────────────────────────────────────────────

function BookmarksScreen({ go, progress, updateProgress }) {
  const [mode, setMode] = useState("list");
  const [qi, setQi]     = useState(0);
  const [ans, setAns]   = useState(null);
  const ALL_Q = [...(CDL_QUESTIONS||[]), ...(Object.values(STATE_Q||{}).flat())];
  const bookmarked = ALL_Q.filter(q => progress.bookmarked?.includes(q.id));
  const q = bookmarked[qi];

  if (mode==="drill" && q) return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title={`Question ${qi+1}/${bookmarked.length}`} subtitle="BOOKMARKED DRILL" color={C.amber} back onBack={()=>{setMode("list");setAns(null);setQi(0);}} />
      <div style={{padding:"0 20px"}}>
        <div style={{background:C.bg2,border:"1px solid "+C.amber+"30",borderRadius:14,padding:18,marginBottom:14}}>
          <div style={{color:C.offWhite,fontSize:14,fontFamily:"Barlow,sans-serif",lineHeight:1.6}}>{q.q}</div>
        </div>
        {q.opts.map((opt,i)=>{
          const correct=i===q.ans; const chosen=ans===i;
          const bg=ans!==null?(correct?"#10B98120":chosen?"#EF535020":C.bg2):C.bg2;
          const bc=ans!==null?(correct?"#10B981":chosen?"#EF5350":C.border):C.border;
          return <button key={i} onClick={()=>ans===null&&setAns(i)} style={{width:"100%",background:bg,border:"1px solid "+bc,borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",marginBottom:8,color:C.offWhite,fontSize:13,fontFamily:"Barlow,sans-serif"}}>{opt}</button>;
        })}
        {ans!==null&&<>
          <div style={{background:ans===q.ans?"#10B98120":"#EF535020",border:"1px solid "+(ans===q.ans?"#10B981":"#EF5350")+"40",borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{color:ans===q.ans?"#10B981":"#EF5350",fontSize:12,fontWeight:700,marginBottom:4}}>{ans===q.ans?"✓ CORRECT":"✗ INCORRECT"}</div>
            <div style={{color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",lineHeight:1.5}}>{q.exp}</div>
          </div>
          <button onClick={()=>{setAns(null);qi+1<bookmarked.length?setQi(qi+1):(setMode("list"),setQi(0));}} style={{width:"100%",background:C.amber,border:"none",borderRadius:12,padding:14,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:1.5}}>
            {qi+1<bookmarked.length?"NEXT QUESTION":"FINISH DRILL"}
          </button>
        </>}
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title="Saved Questions" subtitle="BOOKMARKED DRILL" color={C.amber} back onBack={()=>go("profile")} />
      <div style={{padding:"0 16px"}}>
        {bookmarked.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>🔖</div>
            <div style={{color:C.offWhite,fontSize:16,fontFamily:"Barlow,sans-serif"}}>No saved questions yet</div>
            <div style={{color:C.gray2,fontSize:13,fontFamily:"Barlow,sans-serif",marginTop:8}}>Bookmark questions in CDL Prep to drill them here</div>
          </div>
        ):(
          <>
            <button onClick={()=>setMode("drill")} style={{width:"100%",background:C.amber,border:"none",borderRadius:12,padding:14,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:1.5,marginBottom:14}}>
              DRILL ALL {bookmarked.length} SAVED QUESTIONS
            </button>
            {bookmarked.map((q,i)=>(
              <div key={i} style={{background:C.bg2,border:"1px solid "+C.border,borderRadius:12,padding:14,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{color:C.offWhite,fontSize:13,fontFamily:"Barlow,sans-serif",flex:1}}>{q.q}</div>
                <button onClick={()=>updateProgress({bookmarked:progress.bookmarked.filter(id=>id!==q.id)})} style={{background:"none",border:"none",color:C.gray2,fontSize:18,cursor:"pointer",flexShrink:0}}>×</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function CommunityScreen({ go, track }) {
  const POSTS = [
    {id:1,author:"TexasTrucker88",avatar:"🤠",role:"Company Driver",time:"5h ago",q:"Best fuel stop between Dallas and El Paso on I-10?",a:"Flying J in Van Horn. Cheaper than anything in Midland. Fill up there heading west.",likes:24,tag:"Routes"},
    {id:2,author:"OwnerOpMike",avatar:"🚛",role:"Owner-Operator",time:"1d ago",q:"Broker offering $2.10/mile on 800-mile round trip. My CPM is $1.72. Worth it?",a:"Run the full math. $1,680 gross - $1,376 costs = $304 profit. Thin but positive. Counter at $2.25 first.",likes:31,tag:"Business"},
    {id:3,author:"NewDriver_Keisha",avatar:"👩‍✈️",role:"CDL Student",time:"3h ago",q:"Failed my air brakes test twice. Any tips?",a:"Air brakes trips everyone up. Study the 5 tests cold: build-up, governor, warning signal, spring brake, leakdown. Know the PSI numbers.",likes:18,tag:"CDL Prep"},
    {id:4,author:"FleetManager_Dan",avatar:"📋",role:"Fleet Manager",time:"2d ago",q:"Best ELD for a small fleet of 8 trucks?",a:"Samsara or KeepTruckin for small fleets. Both integrate with IFTA. KeepTruckin has better driver app.",likes:12,tag:"Tech"},
    {id:5,author:"LongHaulLarry",avatar:"🎸",role:"Owner-Operator",time:"12h ago",q:"Anyone running the I-80 corridor in winter? Road conditions?",a:"Wyoming stretch is brutal Dec-Feb. Always check 511 before Elk Mountain. Chains required signs are serious.",likes:29,tag:"Weather"},
  ];
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100}}>
      <PageHeader title="Community" subtitle="DRIVER NETWORK" color={C.blue} />
      <div style={{padding:"0 16px"}}>
        <div style={{background:"linear-gradient(135deg,#0A1628,#0D1117)",border:"1px solid "+C.blue+"30",borderRadius:14,padding:16,marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:28}}>🧔🏿</span>
          <div>
            <div style={{color:C.blue,fontSize:12,fontWeight:700,fontFamily:"Barlow,sans-serif"}}>Ask Big Earl directly</div>
            <div style={{color:C.gray2,fontSize:11,fontFamily:"Barlow,sans-serif"}}>Tap the Earl button anytime for instant answers</div>
          </div>
        </div>
        {POSTS.map(post=>(
          <div key={post.id} style={{background:C.bg2,border:"1px solid "+C.border,borderRadius:14,padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:24}}>{post.avatar}</span>
                <div>
                  <div style={{color:C.white,fontSize:12,fontWeight:700,fontFamily:"Barlow,sans-serif"}}>{post.author}</div>
                  <div style={{color:C.gray2,fontSize:10,fontFamily:"Barlow,sans-serif"}}>{post.role} · {post.time}</div>
                </div>
              </div>
              <span style={{background:C.blue+"20",color:C.blue,fontSize:9,fontFamily:"Barlow,sans-serif",fontWeight:700,padding:"2px 8px",borderRadius:10}}>{post.tag}</span>
            </div>
            <div style={{color:C.offWhite,fontSize:13,fontFamily:"Barlow,sans-serif",fontWeight:600,marginBottom:8}}>Q: {post.q}</div>
            {post.a && <div style={{background:C.bg3,borderRadius:10,padding:"10px 12px",color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",lineHeight:1.6}}>A: {post.a}</div>}
            <div style={{marginTop:8,display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:14}}>👍</span>
              <span style={{color:C.gray2,fontSize:11,fontFamily:"Barlow,sans-serif"}}>{post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsScreen({ go }) {
  const tools = [
    { icon:"💰", label:"Rate Per Mile Calculator", desc:"Know if a load is worth taking before you accept", screen:"rateCalc", color:C.green, badge:"OWNER-OP" },
    { icon:"🔍", label:"Pre-Trip Inspection Trainer", desc:"Interactive walkthrough of every inspection point", screen:"pretrip", color:C.amber, badge:"ALL DRIVERS" },
    { icon:"🗺️", label:"Live Traffic & Incidents Map", desc:"Real-time accidents, closures, and road conditions", screen:"trafficMap", color:"#EF5350", badge:"ALL DRIVERS" },
    { icon:"💼", label:"CDL Job Search", desc:"Browse real trucking jobs - OTR, regional, local, owner-op", screen:"jobSearch", color:"#8B5CF6", badge:"ALL DRIVERS" },
    { icon:"📊", label:"HOS Calculator", desc:"Track your hours and plan your day", screen:"hosCalc", color:C.blue, badge:"COMING SOON" },
    { icon:"⛽", label:"Fuel Savings Estimator", desc:"Calculate how much better fuel habits save annually", screen:"fuelCalc", color:C.purple, badge:"COMING SOON" },
  ]; return (
    <div>
      <PageHeader title="Driver Tools" subtitle="BUSINESS AND SAFETY TOOLS" color={C.green}>
        <div style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif", marginTop:6 }}>Real tools for real drivers. No fluff.</div>
      </PageHeader>
      <div style={{ padding:"18px 24px" }}>
        {tools.map((tool,i)=>(
          <button key={i} onClick={()=>tool.badge!=="COMING SOON"&&go(tool.screen)} style={{ background:C.bg2,border:"1px solid "+(tool.badge==="COMING SOON"?C.border:tool.color+"30"),borderRadius:14,padding:"18px 20px",cursor:tool.badge==="COMING SOON"?"default":"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",marginBottom:12,width:"100%",opacity:tool.badge==="COMING SOON"?0.6:1,position:"relative",overflow:"hidden",animation:"slideUp .3s ease "+i*.08+"s both" }}>
            <div style={{ position:"absolute",left:0,top:0,bottom:0,width:3,background:tool.color }}/>
            <div style={{ width:48,height:48,borderRadius:12,background:tool.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{tool.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:tool.badge==="COMING SOON"?C.gray1:C.white,fontSize:15,fontWeight:600 }}>{tool.label}</div>
              <div style={{ color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",marginTop:2 }}>{tool.desc}</div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6 }}>
              <Tag label={tool.badge} color={tool.color} small/>
              {tool.badge!=="COMING SOON"&&<span style={{ color:tool.color,fontSize:16 }}>{">"}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  ); }

// ─── INPUT ROW (defined outside to prevent focus loss on re-render) ────────────
function InputRow({ label, value, onChange, prefix, suffix }) {
function InputRow({ label, value, onChange, prefix, suffix, placeholder, hint }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif", marginBottom:5, letterSpacing:0.5 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"center", background:C.bg3, border:"1px solid "+C.border, borderRadius:10, overflow:"hidden" }}>
        {prefix && <div style={{ padding:"0 12px", color:C.gray2, fontSize:14, fontFamily:"Barlow,sans-serif", borderRight:"1px solid "+C.border, background:C.bg2 }}>{prefix}</div>}
        <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"0"} style={{ flex:1, background:"transparent", border:"none", padding:"12px 14px", color:C.white, fontSize:16, fontFamily:"Barlow,sans-serif", outline:"none" }} />
        {suffix && <div style={{ padding:"0 12px", color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif" }}>{suffix}</div>}
      </div>
      {hint && <div style={{ color:C.gray2, fontSize:10, fontFamily:"Barlow,sans-serif", marginTop:4 }}>{hint}</div>}
    </div> );
}
function RateCalculatorScreen({ go }) {
  const [offer, setOffer]     = useState("");
  const [miles, setMiles]     = useState("");
  const [fuel, setFuel]       = useState("3.60");
  const [mpg, setMpg]         = useState("6.5");
  const [perDiem, setPerDiem] = useState("0");
  const [other, setOther]     = useState("0");
  const [result, setResult]   = useState(null);

  const calc = () => {
    const gross   = parseFloat(offer) || 0;
    const mi      = parseFloat(miles) || 1;
    const fuelCPM = (parseFloat(fuel) || 3.60) / (parseFloat(mpg) || 6.5);
    const pdCPM   = (parseFloat(perDiem) || 0) / mi;
    const otherCPM= (parseFloat(other) || 0) / mi;
    const totalCPM= fuelCPM + pdCPM + otherCPM;
    const rpm     = gross / mi;
    const profit  = rpm - totalCPM;
    const margin  = gross > 0 ? (profit / rpm) * 100 : 0;
    const verdict = profit > 0.40 ? "TAKE IT" : profit > 0.15 ? "NEGOTIATE" : "PASS";
    const vColor  = profit > 0.40 ? C.green : profit > 0.15 ? C.amber : "#EF5350";
    setResult({ gross, miles:mi, rpm, totalCPM, profit, margin, verdict, vColor, fuelCPM, pdCPM, otherCPM });
  };

  const reset = () => { setOffer(""); setMiles(""); setFuel("3.60"); setMpg("6.5"); setPerDiem("0"); setOther("0"); setResult(null); };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingBottom:100 }}>
      <PageHeader title="Rate Calculator" subtitle="KNOW YOUR NUMBER" color={C.green} back onBack={()=>go("tools")} />
      <div style={{ padding:"0 20px" }}>
        <div style={{ background:C.bg2, borderRadius:14, padding:18, marginBottom:16 }}>
          <div style={{ color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:700, marginBottom:14, letterSpacing:0.5 }}>LOAD DETAILS</div>
          <InputRow label="Total Offer ($)" value={offer} onChange={setOffer} prefix="$" placeholder="2400" />
          <InputRow label="Total Miles" value={miles} onChange={setMiles} suffix="mi" placeholder="800" />
        </div>
        <div style={{ background:C.bg2, borderRadius:14, padding:18, marginBottom:16 }}>
          <div style={{ color:C.white, fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:700, marginBottom:14, letterSpacing:0.5 }}>YOUR COSTS</div>
          <InputRow label="Diesel Price" value={fuel} onChange={setFuel} prefix="$" suffix="/gal" hint="National avg: $3.60" />
          <InputRow label="Fuel Economy" value={mpg} onChange={setMpg} suffix="MPG" hint="Average semi: 6-7 MPG" />
          <InputRow label="Per Diem / Day" value={perDiem} onChange={setPerDiem} prefix="$" hint="IRS rate: $80/day for truckers" />
          <InputRow label="Other Costs (tolls, etc.)" value={other} onChange={setOther} prefix="$" />
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <button onClick={calc} style={{ flex:3, background:"linear-gradient(135deg,"+C.green+",#059669)", border:"none", borderRadius:12, padding:16, color:"#000", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Oswald,sans-serif", letterSpacing:2 }}>CALCULATE</button>
          <button onClick={reset} style={{ flex:1, background:C.bg2, border:"1px solid "+C.border, borderRadius:12, padding:16, color:C.gray2, fontSize:13, cursor:"pointer", fontFamily:"Barlow,sans-serif" }}>Reset</button>
        </div>
        {result && (
          <div style={{ background:result.vColor+"15", border:"2px solid "+result.vColor+"60", borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ color:result.vColor, fontSize:32, fontWeight:700, fontFamily:"Oswald,sans-serif", letterSpacing:3 }}>{result.verdict}</div>
              <div style={{ color:result.vColor, fontSize:24, fontWeight:700, fontFamily:"Oswald,sans-serif" }}>${result.rpm.toFixed(2)}/mi</div>
              <div style={{ color:C.gray2, fontSize:11, fontFamily:"Barlow,sans-serif" }}>Rate Per Mile</div>
            </div>
            {[
              ["Fuel Cost", result.fuelCPM.toFixed(3), "/mi"],
              ["Per Diem", (result.pdCPM).toFixed(3), "/mi"],
              ["Other", result.otherCPM.toFixed(3), "/mi"],
              ["Total Cost", result.totalCPM.toFixed(3), "/mi"],
              ["Net Profit", result.profit.toFixed(3), "/mi"],
              ["Margin", result.margin.toFixed(1), "%"],
            ].map(([label, val, unit]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid "+C.border }}>
                <span style={{ color:C.gray2, fontSize:12, fontFamily:"Barlow,sans-serif" }}>{label}</span>
                <span style={{ color:label==="Net Profit"?result.vColor:C.white, fontSize:13, fontFamily:"Oswald,sans-serif", fontWeight:600 }}>{val}<span style={{ fontSize:10, color:C.gray2 }}>{unit}</span></span>
              </div>
            ))}
            <div style={{ marginTop:14, background:C.bg3, borderRadius:10, padding:12 }}>
              <div style={{ color:C.amber, fontSize:10, fontFamily:"Barlow,sans-serif", fontWeight:700, marginBottom:4 }}>🧔🏿 BIG EARL SAYS</div>
              <div style={{ color:"#ddd", fontSize:11, fontFamily:"Barlow,sans-serif", lineHeight:1.5, fontStyle:"italic" }}>
                {result.profit > 0.40 ? '"That is solid money. Make sure pickup and delivery windows work with your HOS before you accept."'
                  : result.profit > 0.15 ? '"Thin margins. Counter at least 10% higher. If they say no, let it go - there is a better load coming."'
                  : '"Do not touch it. You will lose money or break even at best. Your truck sitting one day costs less than hauling a money-losing load."'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div> );
}

// ─── PRE-TRIP ZONE DIAGRAMS ───────────────────────────────────────────────────
const ZONE_DIAGRAMS = {
  approach: {
    photo: "",
    title: "FRONT OF TRACTOR",
    labels: [
      { text:"Headlights",    x:30, y:60, side:"left" },
      { text:"Turn Signals",  x:30, y:72, side:"left" },
      { text:"Front Bumper",  x:30, y:84, side:"left" },
      { text:"Marker Lights", x:68, y:18, side:"right" },
      { text:"Mirror",        x:68, y:32, side:"right" },
      { text:"Leaks Below",   x:68, y:86, side:"right" },
    ],
    checks:["Check for fluid puddles or drips under engine","Verify lights are proper color, working, not broken","Look for any lean to one side (suspension issue)","Check front bumper and grille for damage"],
  },
  engine: {
    photo: "",
    title: "ENGINE COMPARTMENT",
    labels: [
      { text:"Air Duct Work",   x:30, y:22, side:"left" },
      { text:"Oil Dipstick",    x:30, y:52, side:"left" },
      { text:"Oil Fill",        x:30, y:65, side:"left" },
      { text:"Alternator",      x:68, y:35, side:"right" },
      { text:"Water Pump",      x:68, y:55, side:"right" },
      { text:"Accessory Belts", x:68, y:72, side:"right" },
    ],
    checks:["Oil: between MIN and MAX on dipstick - check level and condition","Coolant in overflow reservoir - not the radiator cap","Belts: no more than 3/4 inch deflection, not cracked or frayed","Hoses: securely mounted, no leaks or cracks"],
  },
  cab: {
    photo: "",
    title: "IN-CAB INSPECTION",
    labels: [
      { text:"Steering Wheel", x:30, y:55, side:"left" },
      { text:"Oil Pressure",   x:30, y:68, side:"left" },
      { text:"Air Pressure",   x:30, y:80, side:"left" },
      { text:"Water Temp",     x:68, y:42, side:"right" },
      { text:"Fuel Gauge",     x:68, y:58, side:"right" },
      { text:"Voltmeter",      x:68, y:72, side:"right" },
    ],
    checks:["Oil pressure: 20-45 PSI normal range","Air pressure: 120-140 PSI when fully charged","Steering wheel: no more than 10 degrees free play","Emergency equipment: triangles, extinguisher, fuses present"],
  },
  lights: {
    photo: "",
    title: "LIGHTS AND REFLECTORS",
    labels: [
      { text:"Headlights",       x:28, y:58, side:"left" },
      { text:"Turn Signals",     x:28, y:70, side:"left" },
      { text:"License Plate",    x:28, y:82, side:"left" },
      { text:"Clearance Lights", x:70, y:16, side:"right" },
      { text:"Marker Lights",    x:70, y:30, side:"right" },
      { text:"Reflectors",       x:70, y:80, side:"right" },
    ],
    checks:["Headlights: test both low beam and high beam","Brake lights: press pedal while someone checks rear","Turn signals: all four corners front and rear","All clearance and marker lights working and proper color"],
  },
  tires: {
    photo: "",
    title: "FRONT WHEEL - TIRES AND RIMS",
    labels: [
      { text:"Tire",              x:28, y:35, side:"left" },
      { text:"Hub Oil Reservoir", x:28, y:52, side:"left" },
      { text:"Outer Hub Oil Seal",x:28, y:68, side:"left" },
      { text:"Wheel / Rim",       x:70, y:32, side:"right" },
      { text:"Lug Nuts",          x:70, y:52, side:"right" },
      { text:"Valve Cap",         x:70, y:70, side:"right" },
    ],
    checks:["Steer tires: 4/32 inch minimum tread depth - use a gauge","No bulges, cuts, or exposed cords on any tire","Lug nuts: all present, no rust streaks or shiny threads","Hub oil seal: not leaking, no missing bolts, proper level"],
  },
  coupling: {
    photo: "",
    title: "COUPLING SYSTEM - FIFTH WHEEL",
    labels: [
      { text:"Mounting Bolts", x:28, y:30, side:"left" },
      { text:"Slide Stops",    x:28, y:48, side:"left" },
      { text:"Welds",          x:28, y:65, side:"left" },
      { text:"Skid Plate",     x:70, y:22, side:"right" },
      { text:"Release Arm",    x:70, y:42, side:"right" },
      { text:"Platform",       x:70, y:62, side:"right" },
      { text:"Locking Pin",    x:70, y:78, side:"right" },
    ],
    checks:["Fifth wheel properly greased - skid plate must be shiny","Locking jaws fully closed around kingpin - no gap allowed","Tug test: pull against locked trailer brakes EVERY single time","Glad hands: red = emergency, blue = service, both connected"],
  },
  trailer_front: {
    photo: "",
    title: "FRONT OF TRAILER",
    labels: [
      { text:"Header Board",    x:28, y:22, side:"left" },
      { text:"Lights (Amber)",  x:28, y:38, side:"left" },
      { text:"Height Sticker",  x:28, y:55, side:"left" },
      { text:"Air Lines",       x:70, y:72, side:"right" },
      { text:"Electric Hookup", x:70, y:84, side:"right" },
    ],
    checks:["Header board: no holes or missing rivets","Lights: working and proper amber color","Height sticker present and legible","Air lines and electric hookup securely connected","No damage to front trailer wall"],
  },
  trailer_side: {
    photo: "",
    title: "SIDE OF TRAILER",
    labels: [
      { text:"Top Rail",       x:28, y:18, side:"left" },
      { text:"Side Panels",    x:28, y:42, side:"left" },
      { text:"Landing Gear",   x:28, y:72, side:"left" },
      { text:"Reflectors",     x:70, y:60, side:"right" },
      { text:"Lights (Amber)", x:70, y:74, side:"right" },
      { text:"Placard Holder", x:70, y:86, side:"right" },
    ],
    checks:["Landing gear: fully raised, handle secure, no missing parts","Side panels: no holes, cracks, or damage","Top and bottom rails: not cracked or bent","Reflectors: present and clean","Lights: front and side amber, rear red"],
  },
  trailer_rear: {
    photo: "",
    title: "REAR OF TRAILER",
    labels: [
      { text:"Door Seals",  x:28, y:22, side:"left" },
      { text:"Hinges",      x:28, y:38, side:"left" },
      { text:"Reflectors",  x:28, y:62, side:"left" },
      { text:"Latches",     x:70, y:30, side:"right" },
      { text:"Lights (Red)",x:70, y:55, side:"right" },
      { text:"DOT Bumper",  x:70, y:82, side:"right" },
      { text:"Splash Guard",x:70, y:70, side:"right" },
    ],
    checks:["Doors: close and latch securely, hinges not damaged","Door seals: intact, no cuts or missing sections","Lights: brake, tail, and turn signals all working red","Reflectors: clean and not broken","DOT bumper: not bent or damaged","License plate: visible and illuminated"],
  },
  trailer_susp: {
    photo: "",
    title: "TRAILER SUSPENSION",
    labels: [
      { text:"Frame",           x:28, y:18, side:"left" },
      { text:"U-Bolts",         x:28, y:35, side:"left" },
      { text:"Spring Mount",    x:28, y:60, side:"left" },
      { text:"Torque Rods",     x:28, y:78, side:"left" },
      { text:"Floor Braces",    x:70, y:22, side:"right" },
      { text:"Tandem Slide Pin",x:70, y:45, side:"right" },
      { text:"Release Arm",     x:70, y:65, side:"right" },
    ],
    checks:["Leaf springs: not shifted, cracked, or missing","Spring mounts: securely mounted front and back","U-bolts: not cracked or broken, all hardware present","Torque rods: mounted securely, not bent or damaged","Tandem slide pins: locked in place"],
  },
  trailer_tires: {
    photo: "",
    title: "TRAILER WHEELS AND TIRES",
    labels: [
      { text:"Tire",           x:28, y:32, side:"left" },
      { text:"Lug Nuts",       x:28, y:55, side:"left" },
      { text:"Outer Axle Seal",x:28, y:75, side:"left" },
      { text:"Bud Rim",        x:70, y:35, side:"right" },
      { text:"Spacer",         x:70, y:60, side:"right" },
    ],
    checks:["Trailer tires: 2/32 inch minimum tread depth (retreads OK)","No bulges, cuts, or exposed cords","Dual tires: no objects wedged between, proper spacing","Lug nuts: none missing, no rust streaks","Outer axle seal: not leaking, no missing bolts"],
  },
};

function ZoneDiagram({ type, color }) {
  const zone = ZONE_DIAGRAMS[type];
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const [zoomed, setZoomed]       = useState(false);
  if (!zone) return null;

  const LabeledPhoto = ({ fullscreen }) => {
    const fs = fullscreen;
    return (
      <div style={{ position:"relative", width:"100%" }}>
        {!imgError ? (
          <img
            src={zone.photo}
            alt={type}
            onLoad={()=>setImgLoaded(true)}
            onError={()=>setImgError(true)} style={{
              width:"100%",
              height: fs ? "auto" : "100%",
              aspectRatio: fs ? "416/297" : undefined,
              objectFit: fs ? "fill" : "cover",
              display:"block",
              filter: fs ? "brightness(1) contrast(1.05)" : "brightness(0.75) contrast(1.05)",
            }}
          />
        ) : (
          <div style={{ width:"100%", height:180, background:"#111318", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ color:color, fontSize:11, fontFamily:"Barlow,sans-serif" }}>{zone.title}</div>
          </div>
        )}

        {/* Left labels */}
        {!imgError && imgLoaded && zone.labels.filter(l=>l.side==="left").map((label,i)=>(
          <div key={i} style={{ position:"absolute", left:0, top:label.y+"%", display:"flex", alignItems:"center", transform:"translateY(-50%)", }}>
            <div style={{
              background:"rgba(0,0,0,0.88)", color:"#EF5350",
              fontSize: fs ? 11 : 8,
              fontFamily:"Barlow,sans-serif", fontWeight:700,
              padding: fs ? "3px 7px" : "2px 5px",
              borderRadius:"3px 0 0 3px",
              whiteSpace:"nowrap", letterSpacing:0.5, lineHeight:1.4, flexShrink:0,
            }}>{label.text}</div>
            <div style={{ width:label.x-2+"%", height: fs?2:1, background:"#EF5350", opacity:0.95 }}/>
            <div style={{ width:fs?7:5, height:fs?7:5, borderRadius:"50%", background:"#EF5350", flexShrink:0 }}/>
          </div>
        ))}

        {/* Right labels */}
        {!imgError && imgLoaded && zone.labels.filter(l=>l.side==="right").map((label,i)=>(
          <div key={i} style={{ position:"absolute", right:0, top:label.y+"%", display:"flex", alignItems:"center", flexDirection:"row-reverse", transform:"translateY(-50%)", }}>
            <div style={{
              background:"rgba(0,0,0,0.88)", color:"#EF5350",
              fontSize: fs ? 11 : 8,
              fontFamily:"Barlow,sans-serif", fontWeight:700,
              padding: fs ? "3px 7px" : "2px 5px",
              borderRadius:"0 3px 3px 0",
              whiteSpace:"nowrap", letterSpacing:0.5, lineHeight:1.4, flexShrink:0,
            }}>{label.text}</div>
            <div style={{ width:(100-label.x-2)+"%", height:fs?2:1, background:"#EF5350", opacity:0.95 }}/>
            <div style={{ width:fs?7:5, height:fs?7:5, borderRadius:"50%", background:"#EF5350", flexShrink:0 }}/>
          </div>
        ))}

        {/* Tap to zoom hint on thumbnail */}
        {!fs && imgLoaded && (
          <div style={{ position:"absolute", bottom:5, left:6, background:"rgba(0,0,0,0.7)", borderRadius:6, padding:"2px 7px", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:9 }}>🔍</span>
            <span style={{ color:"#fff", fontSize:8, fontFamily:"Barlow,sans-serif" }}>Tap to zoom</span>
          </div>
        )}

        {/* Legend */}
        <div style={{ position:"absolute", bottom:5, right:6, display:"flex", gap:4, alignItems:"center" }}>
          <div style={{ width:fs?10:8, height:fs?2:1, background:"#EF5350" }}/>
          <span style={{ color:"#EF5350", fontSize:fs?9:7, fontFamily:"Barlow,sans-serif", fontWeight:700 }}>TEST ITEMS</span>
        </div>
      </div> );
  };

  return (
    <>
      {/* Fullscreen modal */}
      {zoomed && (
        <div onClick={()=>setZoomed(false)} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.96)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", }}>
          {/* Header bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, padding:"48px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)", }}>
            <div style={{ color:"#fff", fontSize:13, fontFamily:"Barlow,sans-serif", fontWeight:600 }}>
              {zone.title}
            </div>
            <button onClick={()=>setZoomed(false)} style={{
              background:"rgba(255,255,255,0.15)", border:"none",
              color:"#fff", fontSize:20, width:36, height:36,
              borderRadius:"50%", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>X</button>
          </div>

          {/* Full image with labels */}
          <div style={{ width:"100%", maxWidth:500, padding:"0 4px", position:"relative" }}>
            <LabeledPhoto fullscreen={true} />
          </div>

          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontFamily:"Barlow,sans-serif", marginTop:16 }}>
            Tap anywhere to close
          </div>
        </div>
      )}

      {/* Thumbnail card - no border/margin since it lives inside column */}
      <div onClick={()=>setZoomed(true)} style={{ cursor:"zoom-in", position:"relative" }}>
        <LabeledPhoto fullscreen={false} />
      </div>
    </> );
}

// ─── PRE-TRIP INSPECTION TRAINER ──────────────────────────────────────────────
function PreTripScreen({ go }) {
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState({});
  const [mode, setMode] = useState("learn"); // learn | quiz
  const [showVideo, setShowVideo] = useState(false);

  const INSPECTION_ZONES = [
    { id:"approach", icon:"👀", label:"Approach & Overview", color:C.amber, videoId:"3sTDqAq1Bw0", videoStart:0, diagram:"approach", items:[ { id:"a1", item:"Walk around the entire vehicle noting obvious damage, leaks, or tire issues" },
        { id:"a2", item:"Check for fluid leaks under the vehicle (oil, coolant, fuel, brake fluid)" },
        { id:"a3", item:"Verify cargo securement visible from outside is intact" },
        { id:"a4", item:"Check that all required documents are in cab (registration, permits, IFTA)" },
      ]},
    { id:"engine", icon:"🔧", label:"Engine Compartment", color:C.blue, videoId:"Gg_P9oMRVoA", videoStart:0, diagram:"engine", items:[ { id:"e1", item:"Engine oil level - between MIN and MAX on dipstick" },
        { id:"e2", item:"Coolant level in overflow reservoir - not the radiator cap" },
        { id:"e3", item:"Power steering fluid - check reservoir level" },
        { id:"e4", item:"Windshield washer fluid - especially important in winter" },
        { id:"e5", item:"Belts - check for cracks, fraying, or glazing. No more than 3/4 inch deflection" },
        { id:"e6", item:"Hoses - check for leaks, cracks, or soft spots" },
        { id:"e7", item:"Battery - check terminals for corrosion. Cables secure and undamaged" },
      ]},
    { id:"cab", icon:"🪑", label:"Cab Interior", color:C.green, videoId:"DjWbGFqX0Fk", videoStart:0, diagram:"cab", items:[ { id:"c1", item:"All gauges functional - oil pressure, temp, fuel, air pressure" },
        { id:"c2", item:"Both mirrors adjusted and clean" },
        { id:"c3", item:"Seatbelt operational and unfrayed" },
        { id:"c4", item:"Horn - test before leaving lot" },
        { id:"c5", item:"Wipers and washers operational" },
        { id:"c6", item:"Emergency equipment present - triangles, fire extinguisher, first aid" },
        { id:"c7", item:"Heater and defroster operational" },
      ]},
    { id:"lights", icon:"💡", label:"Lights & Signals", color:C.amber, videoId:"3sTDqAq1Bw0", videoStart:180, diagram:"lights", items:[ { id:"l1", item:"Headlights - low and high beam" },
        { id:"l2", item:"Brake lights - have someone press brakes while you observe" },
        { id:"l3", item:"Turn signals - all four corners, front and rear" },
        { id:"l4", item:"Marker lights - all clearance and identification lights" },
        { id:"l5", item:"Reflectors - all required reflectors clean and intact" },
      ]},
    { id:"tires", icon:"⭕", label:"Tires & Wheels", color:C.red, videoId:"n3_6KtA-tYs", videoStart:0, diagram:"tires", items:[ { id:"t1", item:"Tread depth minimum 4/32 on steer tires, 2/32 on all others" },
        { id:"t2", item:"No cuts, bulges, or exposed cords on any tire" },
        { id:"t3", item:"Tire pressure - check with gauge. Kick is NOT acceptable" },
        { id:"t4", item:"Lug nuts - all present, no rust streaks indicating looseness" },
        { id:"t5", item:"No dual tire spacing issues - tires not touching each other" },
        { id:"t6", item:"Valve stems - intact and capped" },
      ]},
    { id:"coupling", icon:"🔗", label:"Coupling & Fifth Wheel", color:C.blue, videoId:"3sTDqAq1Bw0", videoStart:300, diagram:"coupling", items:[ { id:"k1", item:"Fifth wheel - properly greased and locking jaw closed around kingpin" },
        { id:"k2", item:"Tug test - pull forward against locked trailer brakes" },
        { id:"k3", item:"Glad hands - emergency (red) and service (blue) properly connected" },
        { id:"k4", item:"Electrical connection - 7-pin connector fully seated" },
        { id:"k5", item:"Safety chains or cables - crossed under tongue and connected" },
        { id:"k6", item:"Landing gear - fully raised and crank handle secure" },
      ]},
    { id:"trailer_front", icon:"🚛", label:"Front of Trailer", color:"#8B5CF6", videoId:"3sTDqAq1Bw0", videoStart:0, diagram:"trailer_front", items:[ { id:"tf1", item:"Header board - no holes or missing rivets" },
        { id:"tf2", item:"Front marker lights - working and proper amber color" },
        { id:"tf3", item:"Height sticker - present and legible" },
        { id:"tf4", item:"Air lines - securely connected at glad hands, no leaks" },
        { id:"tf5", item:"Electric hookup - 7-pin connector fully seated and latched" },
      ]},
    { id:"trailer_side", icon:"📦", label:"Side of Trailer", color:"#EC4899", videoId:"3sTDqAq1Bw0", videoStart:0, diagram:"trailer_side", items:[ { id:"ts1", item:"Landing gear - fully raised, handle secure, support frame not damaged" },
        { id:"ts2", item:"Side panels - no holes, cracks, or damage" },
        { id:"ts3", item:"Top and bottom rails - not cracked, bent, or damaged" },
        { id:"ts4", item:"Side marker lights - amber color, working, not broken" },
        { id:"ts5", item:"Reflectors - clean, intact, and proper placement" },
        { id:"ts6", item:"Placard holder - present and secure" },
      ]},
    { id:"trailer_rear", icon:"🚪", label:"Rear of Trailer", color:"#EF5350", videoId:"3sTDqAq1Bw0", videoStart:0, diagram:"trailer_rear", items:[ { id:"tr1", item:"Doors - close and latch securely, hinges not damaged" },
        { id:"tr2", item:"Door seals - intact, no cuts or missing sections" },
        { id:"tr3", item:"Tail, brake, and turn signal lights - all working red" },
        { id:"tr4", item:"Reflectors - clean and not broken or missing" },
        { id:"tr5", item:"DOT bumper - not bent or damaged" },
        { id:"tr6", item:"License plate - visible, legible, and illuminated" },
        { id:"tr7", item:"Splash guards - mounted properly, not missing or torn" },
      ]},
    { id:"trailer_susp", icon:"⚙️", label:"Trailer Suspension", color:"#F59E0B", videoId:"3sTDqAq1Bw0", videoStart:0, diagram:"trailer_susp", items:[ { id:"tsu1", item:"Leaf springs - not shifted, cracked, or missing" },
        { id:"tsu2", item:"Spring mounts - securely mounted front and back, not cracked" },
        { id:"tsu3", item:"U-bolts - not cracked or broken, all hardware present" },
        { id:"tsu4", item:"Torque rods - mounted securely, not bent or damaged" },
        { id:"tsu5", item:"Tandem slide pins - locked in place, release handle secure" },
      ]},
    { id:"trailer_tires", icon:"🔵", label:"Trailer Tires & Wheels", color:"#10B981", videoId:"3sTDqAq1Bw0", videoStart:0, diagram:"trailer_tires", items:[ { id:"tt1", item:"Tread depth - 2/32 inch minimum (retreads acceptable on trailers)" },
        { id:"tt2", item:"No bulges, cuts, or exposed cords on any tire" },
        { id:"tt3", item:"Dual tires - no objects wedged between, proper spacing" },
        { id:"tt4", item:"Lug nuts - none missing, no rust streaks or shiny threads" },
        { id:"tt5", item:"Outer axle seal - not leaking, no missing bolts" },
      ]},
  ];

  const totalItems = INSPECTION_ZONES.reduce((a,z)=>a+z.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const currentZone = INSPECTION_ZONES[step];

  return (
    <div>
      <PageHeader title="Pre-Trip Trainer" subtitle="INSPECTION WALKTHROUGH" color={C.amber} back="Tools" onBack={()=>go("tools")}>
        <div style={{ marginTop:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif" }}>Zone {step+1} of {INSPECTION_ZONES.length}</span>
            <span style={{ color:C.amber,fontSize:12,fontFamily:"Barlow,sans-serif",fontWeight:600 }}>{checkedCount}/{totalItems} items</span>
          </div>
          <PBar value={(checkedCount/totalItems)*100} color={C.amber} height={5}/>
        </div>
      </PageHeader>
      <div style={{ padding:"18px 24px" }}>
        {/* Zone tabs */}
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:16 }}>
          {INSPECTION_ZONES.map((z,i)=>{
            const zoneDone = z.items.every(item=>checked[item.id]);
            return(
              <button key={z.id} onClick={()=>setStep(i)} style={{ background:step===i?z.color+"20":C.bg2,border:"1px solid "+(step===i?z.color:C.border),borderRadius:20,padding:"6px 12px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,color:step===i?z.color:zoneDone?C.green:C.gray2,fontSize:10,fontFamily:"Barlow,sans-serif",fontWeight:600 }}>
                {z.icon} {zoneDone?"✓":""} {z.label.split(" ")[0]}
              </button> );
          })}
        </div>
        {/* Current zone - PDF style: checklist LEFT, labeled photo RIGHT */}
        <div style={{ background:currentZone.color+"08", border:"1px solid "+currentZone.color+"25", borderRadius:14, marginBottom:16, overflow:"hidden" }}>

          {/* Zone header */}
          <div style={{ background:currentZone.color+"20", padding:"10px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid "+currentZone.color+"30" }}>
            <span style={{ fontSize:22 }}>{currentZone.icon}</span>
            <div style={{ color:currentZone.color, fontSize:14, fontWeight:700, letterSpacing:0.5 }}>{currentZone.label.toUpperCase()}</div>
            <div style={{ marginLeft:"auto", color:currentZone.color, fontSize:10, fontFamily:"Barlow,sans-serif", opacity:0.7 }}>
              {currentZone.items.filter(i=>checked[i.id]).length}/{currentZone.items.length} checked
            </div>
          </div>

          {/* Two-column layout: checklist + photo */}
          <div style={{ display:"flex", alignItems:"flex-start" }}>

            {/* LEFT - Checklist */}
            <div style={{ flex:"0 0 52%", padding:"12px 10px 12px 14px", borderRight:"1px solid "+currentZone.color+"20" }}>
              {currentZone.items.map(item=>(
                <button key={item.id} onClick={()=>setChecked(c=>({...c,[item.id]:!c[item.id]}))}
                  style={{ background:"none", border:"none", padding:"5px 0", cursor:"pointer", display:"flex", alignItems:"flex-start", gap:8, textAlign:"left", width:"100%", marginBottom:2 }}>
                  {/* Checkbox */}
                  <div style={{
                    width:13, height:13, border:"1.5px solid "+(checked[item.id]?currentZone.color:C.gray2),
                    borderRadius:2, flexShrink:0, marginTop:2,
                    background:checked[item.id]?currentZone.color:"transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {checked[item.id] && <span style={{ color:"#000", fontSize:9, lineHeight:1 }}>✓</span>}
                  </div>
                  {/* Item text */}
                  <div style={{
                    color: checked[item.id] ? currentZone.color : C.offWhite,
                    fontSize:11, fontFamily:"Barlow,sans-serif", lineHeight:1.5,
                    textDecoration: checked[item.id] ? "line-through" : "none",
                    opacity: checked[item.id] ? 0.6 : 1,
                  }}>{item.item}</div>
                </button>
              ))}

              {/* Video button below checklist */}
              <button onClick={()=>setShowVideo(!showVideo)} style={{
                marginTop:10, width:"100%", background:currentZone.color+"20",
                border:"1px solid "+currentZone.color+"50", borderRadius:8,
                padding:"9px 12px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:8,
              }}>
                <span style={{ fontSize:18 }}>{showVideo ? "⏹" : "▶️"}</span>
                <div>
                  <div style={{ color:currentZone.color, fontSize:11, fontWeight:700, fontFamily:"Barlow,sans-serif" }}>
                    {showVideo ? "HIDE VIDEO" : "WATCH TRAINING VIDEO"}
                  </div>
                  {!showVideo && <div style={{ color:C.gray2, fontSize:9, fontFamily:"Barlow,sans-serif" }}>CDL pre-trip walkthrough</div>}
                </div>
              </button>
            </div>

            {/* RIGHT - Labeled photo */}
            <div style={{ flex:"0 0 48%", position:"relative" }}>
              <ZoneDiagram type={currentZone.diagram} color={currentZone.color} />
            </div>
          </div>

          {/* Video player - full width below columns */}
          {showVideo && (
            <div style={{ borderTop:"1px solid "+currentZone.color+"30", padding:14 }}>
              {/* YouTube thumbnail + open link - works in all environments */}
              <div style={{ position:"relative", borderRadius:10, overflow:"hidden", marginBottom:10 }}>
                <img
                  src={"https://img.youtube.com/vi/"+currentZone.videoId+"/hqdefault.jpg"}
                  alt="Training video thumbnail" style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block" }}
                />
                {/* Play button overlay */}
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", }}>
                  <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,0,0,0.9)", display:"flex", alignItems:"center", justifyContent:"center", }}>
                    <div style={{ width:0, height:0, borderTop:"10px solid transparent", borderBottom:"10px solid transparent", borderLeft:"18px solid #fff", marginLeft:4 }}/>
                  </div>
                </div>
                {/* Duration badge */}
                {currentZone.videoStart > 0 && (
                  <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.8)", color:"#fff", fontSize:10, fontFamily:"Barlow,sans-serif", padding:"2px 6px", borderRadius:4 }}>
                    Starts at {Math.floor(currentZone.videoStart/60)}:{String(currentZone.videoStart%60).padStart(2,"0")}
                  </div>
                )}
              </div>
              {/* Open in YouTube button */}
              <a
                href={"https://www.youtube.com/watch?v="+currentZone.videoId+(currentZone.videoStart?"&t="+currentZone.videoStart+"s":"")}
                target="_blank"
                rel="noopener noreferrer" style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  background:"#FF0000", borderRadius:8, padding:"10px 16px",
                  color:"#fff", fontSize:12, fontWeight:700,
                  fontFamily:"Oswald,sans-serif", letterSpacing:1.5,
                  textDecoration:"none",
                }}>
                <span style={{ fontSize:16 }}>▶</span> WATCH ON YOUTUBE
              </a>
              <div style={{ color:C.gray2, fontSize:10, fontFamily:"Barlow,sans-serif", textAlign:"center", marginTop:8 }}>
                CDL Pre-Trip Inspection - Full Walkthrough
              </div>
            </div>
          )}
        </div>
        <div style={{ display:"flex",gap:10 }}>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{ flex:1,padding:13,background:"transparent",border:"1px solid "+C.border,borderRadius:12,color:C.gray1,fontSize:12,cursor:"pointer",fontFamily:"Oswald,sans-serif" }}>PREV ZONE</button>}
          {step<INSPECTION_ZONES.length-1?(
            <button onClick={()=>setStep(s=>s+1)} style={{ flex:2,padding:13,background:"linear-gradient(135deg,"+C.amber+",#FF6B00)",border:"none",borderRadius:12,color:"#000",fontSize:13,fontWeight:700,letterSpacing:2,cursor:"pointer" }}>NEXT ZONE</button>
          ):(
            checkedCount===totalItems?(
              <div style={{ flex:2,padding:13,background:C.green+"20",border:"1px solid "+C.green+"40",borderRadius:12,textAlign:"center",color:C.green,fontSize:13,fontWeight:700 }}>INSPECTION COMPLETE ✓</div>
            ):(
              <button onClick={()=>setChecked(c=>{const all={};INSPECTION_ZONES.forEach(z=>z.items.forEach(item=>{all[item.id]=true;}));return all;})} style={{ flex:2,padding:13,background:"linear-gradient(135deg,"+C.green+","+C.green+"bb)",border:"none",borderRadius:12,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer" }}>MARK ALL DONE</button>
            )
          )}
        </div>
        {checkedCount===totalItems&&(
          <div style={{ marginTop:16,textAlign:"center" }}>
            <div style={{ color:C.green,fontSize:14,fontWeight:600 }}>Full Pre-Trip Complete! Ready to roll.</div>
            <button onClick={()=>setChecked({})} style={{ background:"none",border:"none",color:C.gray2,fontSize:12,fontFamily:"Barlow,sans-serif",cursor:"pointer",marginTop:8 }}>Reset for next trip</button>
          </div>
        )}
        {/* Big Earl tip */}
        <div style={{ background:"linear-gradient(135deg,#1A1200,#0D1117)",border:"1px solid "+C.amberDim,borderRadius:14,padding:14,marginTop:16,display:"flex",gap:10 }}>
          <span style={{ fontSize:20,flexShrink:0 }}>🧔🏿</span>
          <div style={{ color:"#ddd",fontSize:12,fontFamily:"Barlow,sans-serif",fontStyle:"italic",lineHeight:1.6 }}>
            {step===0?"Your approach tells you 90% of what you need to know. Slow down and look before you touch anything.":
             step===1?"Low oil and coolant are the two most common engine failures I have seen. Check them every single morning.":
             step===2?"Your mirrors are your eyes. Adjust them before you move, not while moving. Every time.":
             step===3?"Night inspection tip: turn all lights on, walk the truck, then check them. You cannot check what you cannot see.":
             step===4?"Tires are where blowouts start. If a tire does not look right, it is not right. Trust your eyes.":
             "A failed coupling is the most dangerous thing on the road. Tug test every single time. No exceptions."}
          </div>
        </div>
      </div>
    </div> );
}
<?php
function connectDB(){
        $con = mysql_connect("localhost","phpstuff","DaB1gB4dW00lfe");
        if (!$con)
                {
                die("Could not connect: " . mysql_error());
                }
        mysql_select_db("hoursdb") or die(mysql_error());
}
//Declare some global variables
$tag_query = "";
$hours_query = "";
$location_query = "";
$location_tag_query = "";
$loc_id_query = "";
$loc_query_keyword = "";
$location_result = "";
$tag_result = "";
$hours_result = "";
$acc = array('locations' => array(),
        'tags' => array());

//Set supplemental query information, depending on which get parameters are set
function setQueryParams(){
        global $loc_id_query, $loc_query_keyword;
        if (isset($_GET['id']))
                {
                $loc_id_query = " Location.id = " .
                        mysql_real_escape_string($_GET['id']);
                $loc_query_keyword = " AND ";
                } elseif (isset($_GET['tag']))
                {
                $loc_query_keyword = " AND ";
                $loc_id_query = " Tag.id = " .
                        mysql_real_escape_string($_GET['tag']);
                }
}

//Set queries
function setQueries(){
        global $location_query, $loc_query_keyword, $loc_id_query,
                $hours_query, $tag_query;
        $location_query = "SELECT distinct
                        Location.id AS loc_id, Location.name AS loc_name,
                        Location.coords,
                        Location.icon, Location.url,
                        Location.description, Location.isInside,
                        Tag.id AS loc_tag
                        FROM Location, Tag, LocationTag WHERE 
                        LocationTag.fk_location = Location.id
                        AND LocationTag.fk_tag = Tag.id". $loc_query_keyword.
                        $loc_id_query;
        $tag_query = "SELECT id, name FROM Tag";
        $hours_query = "SELECT distinct Location.id AS loc_id, Day.day_index,
                        Day.open, Day.close
                        FROM Location, Calendar, Schedule, Day,
                        Tag, LocationTag
                        WHERE Location.id = Calendar.fk_location AND
                        Calendar.id = Schedule.fk_calendar AND
                        Schedule.id = Day.fk_schedule AND
                        LocationTag.fk_location = Location.id AND
                        LocationTag.fk_tag = Tag.id" .
                        $loc_query_keyword . $loc_id_query;
}

//Make the queries, and store the results
function makeQueries(){
        global $location_result, $location_query, $tag_result,
                $tag_query, $hours_result, $hours_query;
        $location_result = mysql_query($location_query);
        $tag_result = mysql_query($tag_query);
        $hours_result = mysql_query($hours_query);

}

//process the tags
function processTags(){
        global $tag_result, $acc;
        while ($row = mysql_fetch_assoc($tag_result)){
                $acc['tags'][$row['id']] = $row['name'];
                }
}

//process location info
function processLocInfo(){
        global $location_result, $acc;
        while ($row = mysql_fetch_assoc($location_result)){
                $loc_tags = array();
                $loc_tags_query = "SELECT Tag.id AS tag_id
                                FROM Location, LocationTag, Tag
                                WHERE LocationTag.fk_location = Location.id
                                AND LocationTag.fk_tag = Tag.id 
                                AND Location.id = " . $row['loc_id'];
                $loc_tags_result = mysql_query($loc_tags_query);
                while($row2 = mysql_fetch_assoc($loc_tags_result)){
                        $loc_tags[] = $row2['tag_id'];
                }
                $locdata = array('name' => $row['loc_name'],
                                'coords' => $row['coords'],
                                'icon' => $row['icon'],
                                'url' => $row['url'],
                                'parent' => $row['isInside'],
                                'description' => $row['description'],
                                'tags' => $loc_tags);
                $acc['locations'][$row['loc_id']] = $locdata;

        //record tags for this location
        //$acc['locations'][$row['loc_id']]['tags'][] = $row['loc_tag'];
        //initialize hours
                for($i = 0; $i < 7; $i++){
                        $acc['locations'][$row['loc_id']]['hours'][$i] =
                                array();
                }
        }
}

//process hours
function processHours(){
        global $hours_result, $acc;
        while ($row = mysql_fetch_assoc($hours_result)){
                $todayshours = array();
                if(!is_null($row['open'])){
                        $todayshours['open'] = $row['open'];
                }
                if(!is_null($row['close'])){
                        $todayshours['close'] = $row['close'];
                }
                $acc['locations'][$row['loc_id']]['hours'][$row['day_index']][] = $todayshours;
        }
}

connectDB();
setQueryParams();
setQueries();
makeQueries();
processTags();
processLocInfo();
processHours();
$return_value = json_encode($acc);

//header('Content-type: application/json');
echo(stripslashes($return_value));

mysql_close($con);
exit;
?>
                                                                                                 147,2         Bot


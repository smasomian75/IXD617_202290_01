<?php

function makeConn() {
    include_once "auth.php";
    try {
        $conn = new PDO(...Auth());
        $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        die('{"error":"'.$e->getMessage().'"}');
    }
}


function fetchAll($result) {
    $a = [];
    while($row = $result->fetch(\PDO::FETCH_OBJ)) $a[] = $row;
    return $a;
}



function makeQuery($conn,$prep,$params,$makeResults=true) {
    try {
        if (count($params)) {
            $stmt = $conn->prepare($prep);
            $stmt->execute($params);
        } else {
            $stmt = $conn->query($prep);
        }

        $result = $makeResults ? fetchAll($stmt) : [];

        return [
            "result"=>$result
        ];
    } catch (PDOException $e) {
        return ["error"=>"Query Failed: ".$e->getMessage()];
    }
}

function makeStatement($data) {
    $conn = makeConn();
    $type = @$data->type;
    $params = @$data->params;

    switch($type) {
        case "users_all":
            return makeQuery($conn, "SELECT * FROM `track_202290_users`", $params);
        case "animals_all":
            return makeQuery($conn, "SELECT * FROM `track_202290_animals`", $params);
        case "locations_all":
            return makeQuery($conn, "SELECT * FROM `track_202290_locations`", $params);
            
        case "user_by_id":
            return makeQuery($conn, "SELECT id,name,email,username,img,date_create FROM `track_202290_users` WHERE `id`=?", $params);
        case "animal_by_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_animals` WHERE `id`=?", $params);
        case "location_by_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_locations` WHERE `id`=?", $params);

        
        case "animals_by_user_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_animals` WHERE `user_id`=?", $params);        
        case "locations_by_animal_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_locations` WHERE `animal_id`=?", $params);

        

        case "check_signin":
            return makeQuery($conn, "SELECT `id` FROM `track_202290_users` WHERE `username`=? AND `password` = md5(?)", $params);


        default:
            return ["error"=>"No Matched Type"];
    }
}

$data = json_decode(file_get_Contents("php://input"));

die(
    json_encode(
        makeStatement($data),
        JSON_NUMERIC_CHECK
    )
);
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
        // case "users_all":
        //     return makeQuery($conn, "SELECT * FROM `track_202290_users`", $params);
        // case "animals_all":
        //     return makeQuery($conn, "SELECT * FROM `track_202290_animals`", $params);
        // case "locations_all":
        //     return makeQuery($conn, "SELECT * FROM `track_202290_locations`", $params);
            
        case "user_by_id":
            return makeQuery($conn, "SELECT `id`,`name`,`email`,`username`,`img`,`date_create` FROM `track_202290_users` WHERE `id`=?", $params);
        case "animal_by_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_animals` WHERE `id`=?", $params);
        case "location_by_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_locations` WHERE `id`=?", $params);

        
        case "animals_by_user_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_animals` WHERE `user_id`=?", $params);        
        case "locations_by_animal_id":
            return makeQuery($conn, "SELECT * FROM `track_202290_locations` WHERE `animal_id`=?", $params);

        

        case "animal_locations_by_user_id":
            return makeQuery($conn, "SELECT *
            FROM `track_202290_animals` a
            JOIN (
                SELECT * FROM `track_202290_locations`
            ) l
            ON a.id = l.animal_id
            WHERE `user_id`=?
            ", $params);

        case "recent_animal_locations":
            return makeQuery($conn, "SELECT *
            FROM `track_202290_animals` a
            JOIN (
                SELECT lg.*
                FROM `track_202290_locations` lg
                WHERE lg.id = (
                    SELECT lt.id
                    FROM `track_202290_locations` lt
                    WHERE lt.animal_id = lg.animal_id
                    ORDER BY lt.date_create DESC
                    LIMIT 1
                )
            ) l
            ON a.id = l.animal_id
            WHERE `user_id`=?
            ORDER BY l.animal_id, l.date_create DESC
            ", $params);





        /* INSERT */

        case "insert_user":
            $result = makeQuery($conn, "SELECT `id`
            FROM `track_202290_users`
            WHERE `username`=? OR `email`=?
            ", [$params[0],$params[1]]);
            if (count($result['result']) > 0)
                return ["error"=>"Username or Email already exists"];

            $result = makeQuery($conn, "INSERT INTO
            `track_202290_users`
            (
                `username`,
                `email`,
                `password`,
                `img`,
                `date_create`
            )
            VALUES
            (
                ?,
                ?,
                md5(?),
                'https://via.placeholder.com/400/?text=USER',
                NOW()
            )
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["id" => $conn->lastInsertId()];

        case "insert_animal":
            $result = makeQuery($conn, "INSERT INTO
            `track_202290_animals`
            (
                `user_id`,
                `name`,
                `type`,
                `breed`,
                `description`,
                `img`,
                `date_create`
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                'https://via.placeholder.com/400/?text=ANIMAL',
                NOW()
            )
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        case "insert_location":
            $result = makeQuery($conn, "INSERT INTO
            `track_202290_locations`
            (
                `animal_id`,
                `lat`,
                `lng`,
                `description`,
                `photo`,
                `icon`,
                `date_create`
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                'https://via.placeholder.com/400/?text=PHOTO',
                'https://via.placeholder.com/400/?text=ICON',
                NOW()
            )
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];






        /* UPDATE */

        case "update_user":
            $result = makeQuery($conn, "UPDATE
            `track_202290_users`
            SET
                `name` = ?,
                `username` = ?,
                `email` = ?
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];
            
        case "update_password":
            $result = makeQuery($conn, "UPDATE
            `track_202290_users`
            SET
                `password` = md5(?)
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        case "update_animal":
            $result = makeQuery($conn, "UPDATE
            `track_202290_animals`
            SET
                `name` = ?,
                `type` = ?,
                `breed` = ?,
                `description` = ?
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];




            
        /* DELETE */


        case "delete_animal":
            $result = makeQuery($conn, "DELETE FROM
            `track_202290_animals`
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        case "delete_location":
            $result = makeQuery($conn, "DELETE FROM
            `track_202290_locations`
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        

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
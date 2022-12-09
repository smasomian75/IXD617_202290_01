<?php

function makeConn() {
    include_once "auth.php";
    try{
        $conn = new PDO(...Auth());
        $conn -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        die('{"error":"'.$e->getMessage().'"}');
    }
}

function fetchAll($result) {
    $a = [];
    while($row = $result ->fetch(\PDO::FETCH_OBJ)) $a[] = $row;
    return $a;
}



function makeQuery($conn, $prep, $params, $makeResults=true) {
    try {
        if(count($params)){
            $stmt = $conn->prepare($prep);
            $stmt->execute($params);
        }else{
            $stmt = $conn->query($prep);
        }

        $result = $makeResults ? fetchAll($stmt) : [];

        return [
            "result"=>$result
        ];
    } catch(PDOException $e) {
        return ["error" => "Query Failed: ".$e->getMessage()];
    }
}

function makeUpload($file, $folder) {
    $filename = microtime(true) . "_" . $_FILES[$file]['name'];

    if (@move_uploaded_file(
        $_FILES[$file]['tmp_name'],
        $folder.$filename
    )) return ["result"=>$filename];
    else return [
        "error"=>"File Upload Failed",
        "filename"=>$filename
    ];
}





function makeStatement($data){
    $conn = makeConn();
    $type = @$data -> type;
    $params = @$data -> params;

    switch($type) {
        case "users_all":
            return makeQuery($conn, "SELECT * FROM `track_users`", $params);
        case "trash_all":
            return makeQuery($conn, "SELECT * FROM `track_trash`", $params);
        case "locations_all":
            return makeQuery($conn, "SELECT * FROM `track_locations`", $params);


        case "user_by_id":
            return makeQuery($conn, "SELECT id,name,email,username,img,date_create FROM `track_users` WHERE `id` = ?", $params);
        case "trash_by_id":
            return makeQuery($conn, "SELECT * FROM `track_trash` WHERE `id` = ?", $params);
        case "location_by_id":
            return makeQuery($conn, "SELECT * FROM `track_locations` WHERE `id` = ?", $params);

        case "hijab_by_id":
            return makeQuery($conn, "SELECT * FROM `hijab_shows` WHERE `id` = ?", $params);

        case "locations_by_animal_id":
            return makeQuery($conn, "SELECT * FROM `hijab_shows` WHERE `id` != ?", $params);

        case "trash_by_user_id":
            return makeQuery($conn, "SELECT * FROM `track_trash` WHERE `user_id` = ?", $params);

        case "locations_by_trash_id":
            return makeQuery($conn, "SELECT * FROM `track_locations` WHERE `trash_id` = ?", $params);

        case "check_signin":
            return makeQuery($conn, "SELECT `id` from `track_users` WHERE `username`=? AND `password` = md5(?)", $params);


            case "animal_by_show":
            return makeQuery($conn, "SELECT id,name,body,img,data_show,category FROM `hijab_shows` WHERE `user_id` = ?", $params);


        case "animals_by_user_id":
            return makeQuery($conn, "SELECT * FROM `hijab_shows` WHERE `user_id`=?", $params);


        case "locations_by_hijab_id":
            return makeQuery($conn,"SELECT * FROM `locations` WHERE `hijab_id`=?", $params);


//        case "animal_locations_by_user_id":
//            return makeQuery($conn, "SELECT *
//            FROM `hijab_shows` a
//            JOIN (
//                SELECT * FROM `locations`
//            ) l
//            ON a.id = l.hijab_id
//            WHERE `user_id`=?
//            ", $params);
//
//        case "recent_hijab_locations":
//            return makeQuery($conn, "SELECT *
//            FROM `hijab_shows` a
//            JOIN (
//                SELECT lg.*
//                FROM `locations` lg
//                WHERE lg.id = (
//                    SELECT lt.id
//                    FROM `locations` lt
//                    WHERE lt.hijab_id = lg.hijab_id
//                    ORDER BY lt.date_create DESC
//                    LIMIT 1
//                )
//            ) l
//            ON a.id = l.hijab_id
//            WHERE `user_id`=?
//            ORDER BY l.hijab_id, l.date_create DESC
//            ", $params);

        case "recent_hijab_locations":
            return makeQuery($conn,"SELECT *
            FROM `hijab_shows` a
            RIGHT JOIN (
               SELECT * FROM `locations`
               ORDER BY `date_create` DESC
            ) l
            ON a.id = l.hijab_id
            WHERE a.user_id=?
            GROUP BY l.hijab_id
            ",$params);




        case "filter_animals":
            return makeQuery($conn, "SELECT *
            FROM `hijab_shows`
            WHERE 
                `$params[0]` = ? AND
                `user_id` = ?
            ", [$params[1],$params[2]]);

        /* INSERT */

        case "insert_user":
            $result = makeQuery($conn, "SELECT `id`
            FROM `track_users`
            WHERE `username`=? OR `email`=?
            ", [$params[0],$params[1]]);
            if (count($result['result']) > 0)
                return ["error"=>"Username or Email already exists"];

            $result = makeQuery($conn, "INSERT INTO
            `track_users`
            (
                `name`,
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
                ?,
                md5(?),
                'https://via.placeholder.com/400/?text=USER',
                NOW()
            )
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["id" => $conn->lastInsertId()];

        case "insert_hijab":
            $result = makeQuery($conn, "INSERT INTO
            `hijab_shows`
            (
                `user_id`,
                `name`,
                `body`,
                `category`,
                `img`,
                `data_show`
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                NOW()
            )
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];




        /* DELETE */


        case "delete_animal":
            $result = makeQuery($conn, "DELETE FROM
            `hijab_shows`
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        /* search hijab */
        case "search_hijab":
            return makeQuery($conn, "SELECT *
            FROM `hijab_shows`
            WHERE 
                `name` LIKE ? AND
                `user_id` = ?
            ", $params);

        /* Hijab Update */

        case "update_hijab":
            $result = makeQuery($conn, "UPDATE 
            `hijab_shows` 
            SET 
                `name` = ?,
                `body` = ?,
                `img` = ?
                WHERE `id` = ? 
                ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        /* update_password */

        case "update_password":
            $result = makeQuery($conn, "UPDATE
            `track_users`
            SET
                `password` = md5(?)
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        /* UPLOAD */
        case "update_user_photo":
            $result = makeQuery($conn, "UPDATE
            `track_users`
            SET `img` = ?
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

        default:
            return ["error"=>"No Matched Type"];


        case "insert_location":
            $result = makeQuery($conn, "INSERT INTO
            `locations`
            (
                `hijab_id`,
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

        case "update_user":
            $result = makeQuery($conn, "UPDATE
            `track_users`
            SET
                `name` = ?,
                `username` = ?,
                `email` = ?
            WHERE `id` = ?
            ", $params, false);

            if (isset($result['error'])) return $result;
            return ["result"=>"Success"];

    }
}

if (!empty($_FILES)) {
    $result = makeUpload("image","../uploads/");
    die(json_encode($result));
}

$data = json_decode(file_get_contents("php://input"));

die(
json_encode(
    makeStatement($data),
    JSON_NUMERIC_CHECK
)
);
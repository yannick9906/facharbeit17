<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 04.10.2016
     * Time: 22:05
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Util.php';

    $user = \print3d\Util::checkSession();
    $pdo = new \print3d\PDO_Mysql();

    //User ID 0 == current user, so current user is sent.
    $userID = intval($_GET["id"]);
    if($userID == 0) echo json_encode($user);
    else {
        //Else send Data from requested user
        $userToEdit = \print3d\User::fromUID($userID);
        if($userToEdit->getUID() != null)
            echo json_encode($userToEdit);
        else
            //Or fail...
            echo json_encode(["error" => "ID unknown"]);
    }
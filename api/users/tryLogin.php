<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 28.09.2016
     * Time: 20:03
     */
    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once("../../classes/Util.php");
    require_once("../../classes/User.php");
    require_once("../../classes/PDO_Mysql.php");

    $username = $_GET["username"];
    $passhash = $_GET["passhash"];

    $user = \print3d\User::fromUName($username);
    if($user->comparePassHash($passhash)) {
        session_start();
        $_SESSION["username"] = $username;
        $_SESSION["uID"] = $user->getUID();
        echo json_encode(["success" => 1]);
    } else {
        echo json_encode(["success" => 0]);
    }
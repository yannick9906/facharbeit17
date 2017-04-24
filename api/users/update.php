<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 04.10.2016
     * Time: 22:36
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Util.php';

    $user = \print3d\Util::checkSession();
    $pdo = new \print3d\PDO_Mysql();

    $userToEdit = \print3d\User::fromUID(intval($_GET["id"]));
    $realname = $_POST["realname"];
    $passhash = $_POST["passhash"];
    $email = $_POST["email"];
    $recvEmail = $_POST["recvEmail"];

    if($realname != "" && $passhash != "" && $email) {
        $userToEdit->setUEmail($email);
        if($passhash != "NOUPDATE") $userToEdit->setUPassHash($passhash);
        $userToEdit->setURealname($realname);
        $userToEdit->setReceivingEmails($recvEmail == 1);
        $userToEdit->saveChanges();
        echo json_encode(["success" => "1"]);
    } else echo json_encode(["success" => "0", "error" => "missing fields"]);
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

    $user = \print3d\User::checkSession();
    $pdo = new \print3d\PDO_Mysql();
    $userID = intval($_GET["id"]);
    if($userID == 0) $userToEdit = $user;
    else $userToEdit = \print3d\User::fromUID();

    $realname = $_POST["realname"];
    $passhash = $_POST["passhash"];
    $email = $_POST["email"];
    $recvEmail = $_POST["recvEmails"];

    if(isset($_POST["email"])) $userToEdit->setEmail($email);
    if(isset($_POST["passhash"])) $userToEdit->setPasswdHash($passhash);
    if(isset($_POST["realname"])) $userToEdit->setRealname($realname);
    if(isset($_POST["recvEmails"])) $userToEdit->setReceivingEmails($recvEmail == 1);
    $userToEdit->saveChanges();
    echo json_encode(["success" => "1"]);
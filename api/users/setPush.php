<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-04-25
     * Time: 02:34 AM
     */
    require_once "../../classes/PDO_Mysql.php";
    require_once "../../classes/User.php";
    require_once "../../classes/Order.php";
    require_once "../../classes/FilamentType.php";
    require_once "../../classes/passwd.php";
    require_once "../../vendor/autoload.php";

    $user = \print3d\User::checkSession();
    $pdo = new \print3d\PDO_Mysql();

    $endpoint = json_decode($_POST["endpoint"]);
    $user->addEndpoint($endpoint);
    $user->saveChanges();
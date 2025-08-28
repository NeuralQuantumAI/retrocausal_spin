<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Safe4All - Provisioning</title>
    
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="css/safe4all.css" rel="stylesheet">
</head>
<body class="no-pad">
    <div id="mainContainer" class="container-fluid">
        
        <!-- Logo Section -->
        <div class="row text-center logo-section">
            <div class="col-xs-12">
                <img src="images/logo.png" alt="Safe4All Logo" class="main-logo">
                <img src="images/logo_text.png" alt="Safe4All" class="logo-text">
            </div>
        </div>

        <!-- Provisioning Home Section -->
        <div id="provHmBox" class="provision-box">
            <div class="row">
                <div class="col-xs-12 text-center">
                    <h2>Welcome to Safe4All</h2>
                    <p>Choose an option to get started</p>
                </div>
            </div>
            
            <div class="row button-row">
                <div class="col-xs-6">
                    <button id="loginBtn" class="btn btn-primary btn-lg btn-block">
                        <i class="fa fa-sign-in"></i> Login
                    </button>
                </div>
                <div class="col-xs-6">
                    <button id="createAccountBtn" class="btn btn-success btn-lg btn-block">
                        <i class="fa fa-user-plus"></i> Create Account
                    </button>
                </div>
            </div>
            
            <div class="row button-row">
                <div class="col-xs-12">
                    <button id="activateAccountBtn" class="btn btn-info btn-lg btn-block">
                        <i class="fa fa-key"></i> Activate Account
                    </button>
                </div>
            </div>
        </div>

        <!-- Login Section -->
        <div id="loginBox" class="login-box hidden">
            <div class="row">
                <div class="col-xs-12">
                    <button class="btn btn-default btn-sm back-btn" onclick="showProvisioningHome()">
                        <i class="fa fa-arrow-left"></i> Back
                    </button>
                </div>
            </div>
            
            <form id="loginForm" class="login-form">
                <div class="form-group">
                    <label for="roleSelect">Role:</label>
                    <select id="roleSelect" class="form-control" required>
                        <option value="">Select Role</option>
                        <option value="SuperCaregiver">Super Caregiver</option>
                        <option value="Caregiver">Caregiver</option>
                        <option value="Client">Client</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label>4-Digit PIN:</label>
                    <div class="pin-inputs">
                        <input type="password" class="pin-input" maxlength="1" pattern="[0-9]*">
                        <input type="password" class="pin-input" maxlength="1" pattern="[0-9]*">
                        <input type="password" class="pin-input" maxlength="1" pattern="[0-9]*">
                        <input type="password" class="pin-input" maxlength="1" pattern="[0-9]*">
                    </div>
                </div>
                
                <div class="form-group text-center">
                    <button type="submit" class="btn btn-primary btn-lg">
                        <i class="fa fa-sign-in"></i> Login
                    </button>
                </div>
            </form>
        </div>

        <!-- Activation Section -->
        <div id="provActvtnSec" class="activation-box hidden">
            <div class="row">
                <div class="col-xs-12">
                    <button class="btn btn-default btn-sm back-btn" onclick="showProvisioningHome()">
                        <i class="fa fa-arrow-left"></i> Back
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-xs-12 text-center">
                    <h3>Account Activation</h3>
                    <p>Enter your activation code</p>
                </div>
            </div>
            
            <form id="activationForm">
                <div class="form-group">
                    <label for="activationCode">Activation Code:</label>
                    <input type="text" id="activationCode" class="form-control" placeholder="Enter activation code" required>
                </div>
                
                <div class="form-group">
                    <label for="emailPhone">Email or Phone:</label>
                    <input type="text" id="emailPhone" class="form-control" placeholder="Enter email or phone number" required>
                </div>
                
                <div class="form-group text-center">
                    <button type="submit" class="btn btn-info btn-lg">
                        <i class="fa fa-key"></i> Activate
                    </button>
                </div>
            </form>
        </div>

        <!-- New Client Setup Section -->
        <div id="scgNewClntSec" class="new-client-box hidden">
            <div class="row">
                <div class="col-xs-12">
                    <button class="btn btn-default btn-sm back-btn" onclick="showProvisioningHome()">
                        <i class="fa fa-arrow-left"></i> Back
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-xs-12 text-center">
                    <h3>Create New Account</h3>
                </div>
            </div>
            
            <form id="newAccountForm">
                <div class="form-group">
                    <label for="newUsername">Username:</label>
                    <input type="text" id="newUsername" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="newEmail">Email:</label>
                    <input type="email" id="newEmail" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="newPhone">Phone Number:</label>
                    <input type="tel" id="newPhone" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label>Set 4-Digit PIN:</label>
                    <div class="pin-inputs">
                        <input type="password" class="pin-input new-pin" maxlength="1" pattern="[0-9]*">
                        <input type="password" class="pin-input new-pin" maxlength="1" pattern="[0-9]*">
                        <input type="password" class="pin-input new-pin" maxlength="1" pattern="[0-9]*">
                        <input type="password" class="pin-input new-pin" maxlength="1" pattern="[0-9]*">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="profilePhoto">Profile Photo (Optional):</label>
                    <input type="file" id="profilePhoto" class="form-control" accept="image/*">
                </div>
                
                <div class="form-group text-center">
                    <button type="submit" class="btn btn-success btn-lg">
                        <i class="fa fa-user-plus"></i> Create Account
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modals -->
    <div id="alertModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Alert</h4>
                </div>
                <div class="modal-body">
                    <p id="alertMessage"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <script src="js/script.js"></script>
    <script src="js/ipath.js"></script>
</body>
</html>
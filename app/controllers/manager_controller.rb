class ManagerController < ApplicationController
  def edit
    judge = params[:code]
    if judge == "trial" then

      user = params[:email]
      pass = params[:password]

      us = User.find_or_initialize_by(email: user)
      us.update(
        password: pass,
        trial_flg: true
      )

      tu = Mws.find_or_initialize_by(User: user)
      tu.update(
        SellerId: "A1BF7AODC5Z18U",
        AWSkey: "amzn.mws.68b20050-1141-b708-1d2b-64cf970b4523"
      )

    else
      user = params[:email]
      pass = params[:password]
      us = User.find_or_initialize_by(email: user)
      us.update(
        password: pass,
        trial_flg: false
      )
      tu = Mws.find_or_initialize_by(User: user)
      tu.update(
        SellerId: "A1BF7AODC5Z18U",
        AWSkey: "amzn.mws.68b20050-1141-b708-1d2b-64cf970b4523"
      )
      
    end

  end
end

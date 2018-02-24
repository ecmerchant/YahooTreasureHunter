require 'test_helper'

class ManagerControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get manager_edit_url
    assert_response :success
  end

end

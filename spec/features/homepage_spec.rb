require 'rails_helper'

feature 'homepage' do

  scenario 'User can see map on homepage' do
    visit root_path
    expect(page).to have_selector('#world-map')
  end

  scenario 'User can choose GDP per capita and it will populate the map', js: true do
    visit root_path
    select('GDP per capita', :from => 'Pick one:')
    click_on 'Show Map'
    page.find(:css, 'path[data-code="DZ"]')
  end
end
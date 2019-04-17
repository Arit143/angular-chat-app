import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileService } from './../profile.service';

import { CountryDetails } from './../countryDetails';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    /**
     * Array to store all the country details that are required
     */
    countryDetails: CountryDetails[];
    /**
     * Variable to show and hide profile modal
     */
    showModal = false;

    constructor(private profileService: ProfileService) {}

    /**
     * Reactive form for all the profile fields
     */
    profileForm = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        alpha2Code: new FormControl(''),
        callingCodes: new FormControl(''),
        phoneNumber: new FormControl(''),
        currencies: new FormControl(''),
        timezones: new FormControl(''),
        flag: new FormControl('')
    });

    /**
     * Get all the country details on the intialization hook 
     */
    ngOnInit() {
        this.profileService.getCountryDetails()
            .subscribe(countryDetailList => this.countryDetails = countryDetailList);
    }

    /**
     * 
     * @param name 
     * Populate profile fields on country dropdown selection
     */
    onCountryDropdownSelect(name: string) {
        const getDetailsToSet = this.countryDetails.filter(item => item.name === name );
        const { alpha2Code, callingCodes, currencies, timezones, flag } = getDetailsToSet[0];
        this.profileForm.setValue({
            firstName: this.profileForm.value.firstName,
            lastName: this.profileForm.value.lastName,
            alpha2Code,
            callingCodes,
            phoneNumber: this.profileForm.value.phoneNumber,
            currencies,
            timezones,
            flag
        })
    }

    /**
     * Handle click on `My Profile` link
     */
    openDialog() {
        this.showModal = true;
    }

    /**
     * Handle close on profile fields close
     */
    closeDialog() {
        this.showModal = false;
    }
}
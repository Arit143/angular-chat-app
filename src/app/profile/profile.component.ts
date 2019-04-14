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
    countryDetails: CountryDetails[];
    showModal = false;

    constructor(private profileService: ProfileService) {}

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

    ngOnInit() {
        this.profileService.getCountryDetails()
            .subscribe(countryDetailList => this.countryDetails = countryDetailList);
    }

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

    openDialog() {
        this.showModal = true;
    }

    closeDialog() {
        this.showModal = false;
    }
}
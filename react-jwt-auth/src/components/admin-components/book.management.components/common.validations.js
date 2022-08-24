import React from "react";
import { isEmail } from "validator";

export const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

export const vPassword = value => {
    if (value && value.length < 4) {
        return (
            <div className="alert alert-danger" role="alert">
                Password must include more than 4 characters!
            </div>
        );
    }
}

export const vPasswordUserCreate = value => {
    if (!value || value.length < 4) {
        return (
            <div className="alert alert-danger" role="alert">
                Password must include more than 4 characters!
            </div>
        );
    }
}

export const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};
export const vIsbn = value => {
    if (value.length < 10 || value.length > 13) {
        return (
            <div className="alert alert-danger" role="alert">
                The isbn must be a 10 or 13 characters value.
            </div>
        );
    }
};
export const vName = value => {
    if (value.length < 1) {
        return (
            <div className="alert alert-danger" role="alert">
                The name shouldn't be empty.
            </div>
        )
    }
}

export const vAuthorName = value => {
    if (value.length < 1) {
        return (
            <div className="alert alert-danger" role="alert">
                The book author name shouldn't be empty.
            </div>
        )
    }
}
export const vType = value => {
    if (value.length < 1) {
        return (
            <div className="alert alert-danger" role="alert">
                The book type shouldn't be empty.
            </div>
        )
    }
}
export const vYear = value => {
    if (isNaN(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                The book year should be valid.
            </div>
        )
    }else if (!isNaN(value) && value < 1){
        return (
            <div className="alert alert-danger" role="alert">
                Enter a valid year.
            </div>
        )
    }
}
export const vPageNumber = value => {
    if (isNaN(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                The book page should be a number.
            </div>
        )
    }else if (!isNaN(value) && value < 1){
        return (
            <div className="alert alert-danger" role="alert">
                Enter a valid page number.
            </div>
        )
    }
}

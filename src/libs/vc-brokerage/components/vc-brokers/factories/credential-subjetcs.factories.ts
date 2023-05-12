import {KeyValueType} from "@/libs/common/types";
import {get} from "@/libs/common/helpers/object.helpers";

export function credentialSubjectStateId(holderDid: string, params: KeyValueType): KeyValueType {
  return {
    "groups": [
      {
        "id": "names",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/has_first_name",
            "object": get(params, 'firstName')
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/has_middle_name",
            "object": ''
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/has_last_name",
            "object": get(params, 'lastName')
          }
        ],
        "signature": ""
      },
      {
        "id": "birth",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/was_born_on",
            "object": get(params, 'dateOfBirth')
          }
        ],
        "signature": ""
      },
      {
        "id": "citizenship",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/officials/is_citizen_of",
            "object": get(params, 'citizenship')
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/officials/has_citizenship_document_of_type",
            "object": 'passport'
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/officials/issuing_body",
            "object": get(params, 'id')
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/officials/issuance_date",
            "object": get(params, 'dateOfIssuance')
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/core/officials/expiry_date",
            "object": get(params, 'dateOfExpiry')
          }
        ],
        "signature": ""
      }
    ]
  };
}

export function credentialSubjectProofOfResidency(holderDid: string, params: KeyValueType): KeyValueType {
  return {
    "groups": [
      {
        "id": "main",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/officials/is_resident_of_countrye",
            "object": get(params, 'country')
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/officials/is_resident_of_city",
            "object": get(params, 'city')
          },
          {
            "subject": holderDid,
            "predicate": "did:identixschemas/officials/is_resident_of_address",
            "object": get(params, 'address')
          }
        ],
        "signature": ""
      }
    ]
  };
}

export function credentialSubjectEmiratesId(holderDid: string, params: KeyValueType): KeyValueType {
  return {
    "groups": [
      {
        "id": "namesAR",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/first_name",
            "object": get(params, 'firstNameAR')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/last_name",
            "object": get(params, 'lastNameAR')
          },
        ],
        "signature": ""
      },
      {
        "id": "namesEN",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/first_name",
            "object": get(params, 'firstNameEN')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/last_name",
            "object": get(params, 'lastNameEN')
          },
        ],
        "signature": ""
      },
      {
        "id": "gender",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/gender",
            "object": get(params, 'gender')
          },
        ],
        "signature": ""
      },
      {
        "id": "nationalityAR",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/nationality",
            "object": get(params, 'nationalityAR')
          },
        ],
        "signature": ""
      },
      {
        "id": "nationalityEN",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/nationality",
            "object": get(params, 'nationalityEN')
          },
        ],
        "signature": ""
      },
      {
        "id": "id_card",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/idcard_issuance_date",
            "object": get(params, 'idcardIssuanceDate')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/idcard_expiration_date",
            "object": get(params, 'idcardExpirationDate')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/emiratesid/idcard_issuer",
            "object": get(params, 'idcardIssuer')
          }
        ],
        "signature": ""
      }
    ]
  };
}

export function credentialSubjectRealEstate(holderDid: string, params: KeyValueType): KeyValueType {
  return {
    "groups": [
      {
        "id": "titledeedid",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/titledeedid",
            "object": get(params, 'titledeedid')
          }
        ]
      },
      {
        "id": "address",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/city",
            "object": get(params, 'city')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/district",
            "object": get(params, 'district')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/address",
            "object": get(params, 'address')
          },
        ]
      },
      {
        "id": "features",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/type",
            "object": get(params, 'type')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/bedrooms",
            "object": get(params, 'bedrooms')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/livingspace",
            "object": get(params, 'livingspace')
          }
        ]
      },
      {
        "id": "ownership",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/owner",
            "object": get(params, 'owner')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/ownership_begin_date",
            "object": get(params, 'ownership_begin_date')
          }
        ]
      },
      {
        "id": "authority",
        "claims": [
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/issuing_institution",
            "object": get(params, 'issuing_institution')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/issuance_date",
            "object": get(params, 'issuance_date')
          },
          {
            "subject": holderDid,
            "predicate": "https://schemas.identix.space/realestate_v1/certificate_id",
            "object": get(params, 'certificate_id')
          }
        ]
      }
    ]
  };
}
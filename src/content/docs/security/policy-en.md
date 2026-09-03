---
title: Security Policy
template: splash

# NOTE: this file uses "policy-en" instead of "en" because the latter gets interpreted by
# starlight's i18n mechanism -- which we have not yet configured properly (results in 404s).
---

[Deutsche Version](/security/)

Open Pioneer Trails is an open source framework for building client-side web GIS applications. This page describes how to report security vulnerabilities in Open Pioneer Trails and how we handle such reports.

## Definition of a vulnerability

We consider a security vulnerability to be a flaw or weakness in one of the Open Pioneer Trails packages, in the associated documentation/website, or in the infrastructure used to provide these offerings (e.g. repository hosting, build and release pipeline) that can compromise the security objectives of information security — that is, the **confidentiality, integrity, or availability** of systems and data.

Only vulnerabilities that are actually exploitable and pose a recognizable security risk should be reported, such as unauthorized access, execution of arbitrary code, or manipulation of data. In particular, the following do not qualify as vulnerabilities under this policy: social engineering attempts, issues that rely solely on outdated or unsupported browsers, unverified results from automated scanners, denial-of-service attacks, and general support requests.

## Scope

This policy applies to:

- the software packages developed and published by the Open Pioneer Trails community (among others under [github.com/open-pioneer](https://github.com/open-pioneer))
- the project website(s) under the domains open-pioneer.dev, www.open-pioneer.dev, and [open-pioneer.github.io/website/](https://open-pioneer.github.io/website/)
- the infrastructure used to provide these offerings (repository hosting, version control, build and release pipeline), insofar as it is attributable to the project's steward organizations

Applications that are developed and operated by third parties on the basis of Open Pioneer Trails are not within the scope of this policy. Vulnerabilities in such applications should be reported directly to their respective operator.

## Reporting a vulnerability

Please report suspected security vulnerabilities by email to [security@open-pioneer.dev](mailto:security@open-pioneer.dev).

Your report should ideally include:

- a description of the vulnerability and its potential impact
- the affected package, component, or URL (including the version, where applicable)
- a reproducible, step-by-step description (proof of concept)
- relevant technical details (e.g. version, timing, tools used)
- optional: your contact details for follow-up questions
- optional: your assessment of the severity

## Process

We respond promptly upon receiving your report and work with you to understand and analyze the vulnerability. We use established standards (e.g. CVSS) to assess severity. The priority for remediation is determined by impact, severity, and the complexity of exploitation. We keep you informed of progress throughout the process.

## What you can expect from us

We commit to:

- responding to your report promptly and working with you to understand and validate the vulnerability,
- keeping you informed of progress during remediation,
- addressing identified vulnerabilities promptly, within the constraints of an open source project.

Open Pioneer Trails is open source software and, as such, is exempt from numerous obligations under the Cyber Resilience Act (CRA, Regulation (EU) 2024/2847). However, the project's steward organizations (currently con terra GmbH and 52°North GmbH) provide development resources, code review, release management, and handling of vulnerability reports, and as a result are subject to the reporting and information obligations of Art. 14 CRA from 11 September 2026. Actively exploited vulnerabilities will accordingly be reported to the competent national CSIRT or ENISA; users with whom a direct relationship exists will be informed as required.

## How you can support this process

We ask that you:

- report identified vulnerabilities promptly,
- respect the privacy of others and avoid impairing systems, data, or the user experience,
- use only the official reporting channel described above,
- keep information about the vulnerability confidential until it has been resolved,
- limit testing to the systems named in the scope of this policy,
- avoid accessing or modifying more data than is necessary to demonstrate the vulnerability,
- refrain from denial-of-service attacks and extortion attempts.

## Disclosure

By submitting a vulnerability report, you agree to:

- not disclose information about the vulnerability publicly or share it with uninvolved third parties until the vulnerability has been reviewed and appropriate measures have been taken, or an agreed disclosure deadline has passed,
- not use the vulnerability beyond what is necessary to identify and report it, and in particular not to view, modify, download, or delete any data or datasets,
- comply with the laws and regulations applicable at your location,
- observe applicable data protection regulations and, in particular, not disclose third parties' personal data without a valid legal basis,
- be authorized, to the best of your knowledge, to submit the information and attachments provided.

Upon request, we will credit you as the discoverer of the vulnerability as part of a coordinated disclosure.

# Organization verification and payment integrity plan

Discussion draft · 19 October 2026 · Camping Nigeria

## Purpose and starting facts

Prevent organizational money from being diverted into personal accounts through refunds, overpayments, discounts, security deposits or fabricated commissions. Keep legitimate school and organizational bookings straightforward.

The reported incidents involve payments originating from the school or organization's account, followed by requests to refund individuals. No finding about a particular person's intent is made in this document.

Working interpretation: “signs the agent” means “signs the agreement”; the proposed incentive is a ₦100,000 discount on bookings above ₦1 million. These are assumptions for discussion, not approved commercial terms.

This is a proposed operating model and implementation sequence. No policies have been published, customers contacted, or product changes implemented.

## Recommendation and alternatives

Use a universal payment-control policy, lightweight organization verification before booking confirmation, and a controlled refund workflow. Begin with a documented manual process; add enforcement to the existing quote tool.

Three approaches were considered:

| Approach | Strength | Limitation |
|---|---|---|
| Messaging and contract changes only | Fast to introduce | Staff can still execute a prohibited transfer; identity and approval evidence remain weak |
| Policy, organization verification and refund controls | Addresses the reported mechanism and supports legitimate exceptions | Needs named ownership and modest software work; recommended |
| Extensive financial KYC before every quote | Collects more information early | Adds friction and sensitive data without necessarily stopping refund diversion |

The objective is an auditable chain linking the contracting organization, authorized people, invoice, actual payment source and permitted refund destination. KYC alone does not establish that a refund instruction is legitimate.

## 1. Payment and refund rules

1. Register one primary organizational payment account per booking. Verify the account holder against the contracting legal entity. A school may use the registered company or trust that operates it; document that relationship instead of requiring a literal match to its public school name.
2. Ask organizational customers to pay from that registered account into Camping Nigeria's designated business account. Do not allow staff personal accounts to collect organizational payments.
3. Return any eligible refund to the original verified payment source, including overpayments, cancellation refunds and refundable security deposits. A newly supplied beneficiary is not sufficient authority to redirect funds.
4. Never redirect an organizational payment to an employee, coordinator, principal, director or other individual's personal account. A letter requesting it does not override this rule.
5. Confirm receipt and source from Camping Nigeria's bank or payment provider records, not a customer screenshot alone. Where origin details are incomplete, finance resolves them with the bank/provider before issuing a refund.
6. If a different account sends money unexpectedly, record it as received but unreconciled. Investigate the payer relationship; do not silently treat it as an approved booking payment. If returning it, use a bank/provider-supported return to source after verification.
7. Every refund must link to its original payment, invoice, calculation, reason, requester, preparer, approver and payout evidence. Prevent aggregate refunds and reversals from exceeding the settled refundable amount.
8. Notify the independently verified organization finance contact of invoices, discounts, material amendments, refund requests and completed refunds. Keep notifications factual.

### Legitimate exceptions

An organization may have multiple accounts or pay through its parent company, PTA or sponsor. Approve and document these relationships before payment where possible. Preserve each payment's origin; refunds against several payments return to their respective sources and cannot be consolidated into an unrelated account.

A future bank-account change requires renewed ownership and authority checks and notification through an existing verified contact. It must not rewrite the source attached to historical payments.

If an originating account is closed or frozen, finance must use a documented bank/provider-assisted resolution, independent organization confirmation and two internal approvals. Any alternative destination must belong to the verified entitled legal entity. There is no staff-personal-account override. Obtain legal input if entitlement is disputed.

For card/provider transactions, use the provider's refund mechanism against the original transaction where available. Do not convert a card refund into an arbitrary bank transfer.

Separate refund eligibility from destination checks. Preserve lawful refund rights and existing contractual commitments; verification must not become an indefinite hold or a reason to retain money that is owed.

## 2. Organization verification in the quote journey

Customer-facing name: **Organization registration and payment verification**. Internally, this is a proportionate KYB/KYC process, subject to any additional legal obligations that apply to Camping Nigeria.

### Enquiry and indicative quote

Collect organization name/type, contact name/role, email, phone and booking requirements. Show the payment policy early. Let prospects receive indicative pricing without uploading bank documents.

### Before booking confirmation and payment instructions

Create a reusable organization profile and verify:

| Information | Purpose and verification |
|---|---|
| Legal name, trading/school name and address | Identify the contracting entity and school operator |
| Registration or establishment evidence appropriate to entity type | Check the entity; do not require every public school or other entity to have an identical CAC document |
| Booking representative's name, role and authority | Establish who may negotiate and place the booking |
| Finance contact and authorized signatory | Establish who receives financial records and may approve changes |
| Bank, account number and account holder | Establish the intended payment source and ownership |
| Evidence connecting differing legal, school and bank names | Resolve a legitimate mismatch rather than automatically rejecting it |
| Acceptance of the applicable agreement and payment policy | Record the accepting person's identity, role, date and exact document version |

Confirm organizational authority through an independently sourced school/organization contact or existing trusted relationship. A second email address supplied by the same requester is not independent verification. A corporate email domain helps but is not proof; a school using Gmail needs an alternative verification path.

Bank account-name checks establish the beneficiary name, not the contact person's authority or the legitimacy of a refund. Request a bank confirmation or redacted account header only when necessary. Do not request account balances or transaction history merely to prove ownership.

Reuse approved profiles for future bookings. Reverify changed accounts, legal entities, signatories and material risk signals. For ordinary individual bookings, use a lighter process while retaining the return-to-source rule.

### Data handling

Do not routinely collect BVNs, NINs, personal financial statements, bank credentials or children's information for organization payment verification. Escalated identity checks need a defined purpose, lawful basis and proportionate collection method.

Before collecting new data, document the purpose and lawful basis, give a clear privacy notice, restrict access, set retention/deletion periods and assess external processors. Bank documents belong in restricted storage, never in the published catalogue spreadsheet, public document links or general email attachments. Mask account details in routine screens and notifications.

NDPC's published privacy guidance describes minimisation, purpose limitation, limited retention and appropriate security. This supports collecting only what is needed; it does not mean a consent checkbox alone resolves every processing obligation. [NDPC privacy principles](https://erp.ndpc.gov.ng/privacy_policies).

## 3. Agreements and messaging

Prepare four connected items:

1. A short organization payment and refund policy, shown before payment.
2. Organization registration and finance-contact form.
3. Relevant school/programme agreement and rental-agreement amendments, with an approved-account schedule.
4. Internal refund, exception and incident-handling procedure.

Agreement provisions should cover the contracting entity, representative authority, source-account policy, verification of changed details, no personal refund destinations, disclosed institutional discounts, no undisclosed personal commissions, invoice amendments, escalation and the applicable cancellation terms.

Keep the organization's authority to book separate from the authority to instruct a refund. Explicit organizational acceptance should retain the exact document version and authorized signatory evidence. A signature by itself is not proof of authority.

Draft customer notice:

> To protect your organization's funds and keep clear financial records, Camping Nigeria verifies organizational payment details before confirming bookings. Please pay from your registered organizational account. Any eligible refund, including an overpayment or security-deposit balance, will return to the account from which that payment was received. We do not redirect organizational refunds to staff members or other personal accounts. All discounts are shown on the organization's invoice.

Draft response to a personal-account refund request:

> Thank you. We can process any refund due back to the school's original payment account. Our policy does not permit payment of organizational refunds into personal accounts. We will confirm the refund amount and processing details with the school's verified finance contact.

These are drafting proposals. Have Nigerian counsel review the final clauses and their interaction with consumer rights. FCCPA section 120 provides cancellation rights subject to reasonable charges and includes an exception concerning death or hospitalisation; the financial-control policy must not override applicable rights. [FCCPA, section 120](https://fccpc.gov.ng/wp-content/uploads/2022/07/FCCPA-2018.pdf).

## 4. The proposed ₦100,000 incentive

Verification and acceptance of booking terms should be mandatory for all organizational customers, independent of discounts. Avoid presenting the offer as payment in exchange for financial data.

If commercially justified, test an **institutional booking discount**:

- Apply it visibly to the school's invoice before payment; never pay it as cash or a personal rebate.
- Proposed eligibility: the first qualifying booking per verified legal entity, with an eligible service subtotal strictly above ₦1 million before this discount and VAT. Exclude refundable deposits and pass-through expenses from threshold calculations.
- Require completed registration and authorized agreement acceptance before the final invoice.
- Define eligible services, offer dates, a fixed pilot budget, combination with other offers, and how related bookings are treated. Prevent duplicate organizations and booking splits from creating repeat discounts.
- Recalculate eligibility on material booking changes before confirming revised terms. Refund calculations must reflect actual payments and the documented discounted price, without inventing a retrospective penalty.
- Keep the offer off public pages until margin and scope are approved.

The financial trade-off is material. On an illustrative ₦1.1 million eligible booking, ₦100,000 is a 9.1% revenue reduction. If contribution before the discount were ₦275,000, it would fall to ₦175,000, a 36.4% reduction. These are examples, not Camping Nigeria margin estimates.

Recommended decision: implement controls immediately; approve any discount as a separate commercial pilot after reviewing actual job costs. Signing the agreement alone is not a sufficient reason to subsidise every booking.

## 5. Internal responsibilities and incident handling

| Role | Responsibility |
|---|---|
| Sales/booking coordinator | Collect details, communicate policy, create the quote; cannot approve their own refund or account change |
| Finance/preparer | Verify settled receipts and source, calculate eligible amount, prepare refund record |
| Independent approver | Check entitlement, original source and supporting evidence before release |
| Director/owner | Resolve exceptions and suspicious requests; review recurring patterns |

People may hold multiple operational roles in a small team, but the same person must not both prepare and approve an outgoing refund. Apply separation in the business bank's payment permissions where supported; an application approval alone does not control a bank transfer.

For an incident: stop the proposed redirection, preserve the request and transaction evidence in restricted records, verify facts with an independent organization contact, and escalate internally. If funds were already misdirected, contact the bank promptly about tracing or recall and obtain case-specific legal advice. Do not classify every unusual request as proven corruption or circulate accusations.

Reject inflated invoices, fictitious service lines and undisclosed personal commissions. Any legitimate referral arrangement needs a separate documented basis, conflict review and disclosure; it cannot serve as an alternative route for an organizational refund.

Ask counsel to determine whether Camping Nigeria's actual activities bring it within SCUML obligations and what additional due diligence, retention or reporting would follow. SCUML's 2025 service-level document includes hotels and hospitality businesses; that alone does not establish Camping Nigeria's classification. [SCUML service-level agreement](https://scumlportal.efcc.gov.ng/SERVICE%20LEVEL%20AGREEMENT.pdf).

## 6. Existing implementation and proposed changes

Read-only local inspection on 19 October 2026 established:

- The website gear form submits to the separate quote-tool application. School proposal capture is a separate website flow; rental-only integration would leave school programme bookings uncovered.
- The quote tool has quotes, invoices, receipts and an equipment rental agreement. Its customer fields identify a contact and optional organization, without the proposed verification record.
- Payment records contain amount, date, method and reference, but the inspected payment route has no originating-account fields. It records `created_by: "system"`.
- Sign-in uses a shared password, so it cannot establish distinct staff identities for approvals.
- The rental agreement currently describes acceptance through payment and says a further signature is generally unnecessary. Its refund clauses do not prescribe the original source as destination.
- Website programme cancellation windows differ from rental-agreement windows. These may legitimately differ by service; clearly identify which terms apply instead of silently replacing one with the other.

This is source inspection, not verification of deployed configuration, bank processes or historical transactions.

### Proposed tool work, in dependency order

1. **Named staff identities and permissions.** Protect sensitive reads and financial writes on the server. Establish who can verify accounts, approve changes and approve refunds. Avoid granting the shared-login model access to new bank documents.
2. **Organization profiles and private onboarding.** Add a scoped, expiring customer invitation with appropriate recipient verification; do not expose the internal tool to customers. Support school programme bookings as well as rentals. Keep evidence restricted and log access and decisions.
3. **Versioned agreement acceptance.** Associate verified authority and the accepted policy version with the booking. Reuse a valid master agreement where appropriate while preserving booking-specific terms.
4. **Payment provenance and reconciliation.** Store the confirmed source account/provider transaction, organization, invoice and bank evidence. Do not mark self-submitted information as verified. Ensure retry-safe posting, duplicate detection and transaction-safe totals.
5. **Controlled refunds.** Refunds select original payment records rather than accepting arbitrary beneficiaries. Enforce remaining refundable limits, two-person approval, bank/provider execution evidence and retry protection. Record account exceptions separately. A policy flag in the UI is insufficient.
6. **Document consistency and reporting.** Carry the policy through quotes, invoices, agreements, receipts and refund confirmations. Notify verified finance contacts. Report unreconciled receipts, refunds awaiting action and approved exceptions.

Audit records should identify real actors and preserve earlier values; authorized corrections should create a new record rather than erase history. Prevent general staff from changing financial evidence or approvals after the fact.

## 7. Rollout and acceptance

Indicative sequence; software effort depends on a focused implementation assessment.

| Phase | Deliverable | Owner | Completion evidence |
|---|---|---|---|
| First 1–2 working days | Adopt return-to-source handling, two-person bank approval and restricted refund register; review pending requests | Owner + finance | Every pending refund has a known source, documented entitlement and an independent reviewer |
| First week | Review legal wording, verify active organizational customers, agree responsibilities, define discount economics | Operations + counsel + owner | Approved policy and forms; active bookings have verified finance contacts; discount decision recorded |
| Next implementation cycle | Named access, organization onboarding, acceptance and source-account records | Engineering + operations | End-to-end staging evidence across both school and rental flows |
| Following cycle | Refund workflow, exceptions, notifications and reconciliation reports | Engineering + finance | Bank/provider process rehearsed, permissions and failure cases verified |
| After 30 days of use | Review control adherence and customer friction | Owner + finance | Evidence-based decision on process changes and any discount pilot |

Before release, verify at least these scenarios:

- A school pays and asks for a personal refund: destination is blocked and staff can explain the policy.
- A school uses its documented parent-company account: legitimate booking succeeds.
- An account changes after payment: historic refund source remains intact.
- Two settled payments fund a booking: partial refunds remain attributable and capped per source.
- A refund is retried or approved concurrently: no duplicate payout or excess refund occurs.
- A staff member tries to prepare and approve the same refund: server and payment process prevent it.
- A requester impersonates the finance contact: independent verification is required.
- An unauthorized user accesses bank documents or financial actions: access is denied.
- A mandatory refund is due: identity checks and escalation resolve it within the applicable timeline.
- A school programme booking enters through the school form: the same organizational controls apply.

Track verified booking coverage, source-linked receipt coverage, refund approval compliance, reconciled payout evidence, exception rates, refund processing time, overdue legitimate refunds and customer onboarding abandonment. For any discount pilot, also track contribution after discount and duplicate-claim attempts. Counts of rejected requests alone do not prove money saved or corruption prevented.

## Local evidence pointers

- Website: `components/gear-rental/QuoteForm.tsx`, `app/api/proposal/route.ts`, `app/terms/page.tsx`, `app/privacy-policy/page.tsx`.
- Quote tool at `C:/dev/camping-nigeria-quote-tool/quote-tool`: `components/CustomerForm.tsx`, `lib/invoices.ts`, `app/api/invoices/[id]/payments/route.ts`, `app/api/sign-in/route.ts`, `proxy.ts`, `docs/service-agreement.md`.

## Decisions to settle before implementation

Confirm the proposed rules and exception ownership; appoint finance preparer and independent approver; settle the verification evidence appropriate to each organization type; obtain legal review; and approve or decline the separately costed discount pilot. These choices should precede publishing new terms or collecting additional customer documents.

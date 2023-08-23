<template>
  <ModalCover
    show_close_btn
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xxl' }"
    place_center
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header pdb-5">
        <!-- BRAND LOGO -->
        <div class="brand-logo mgb-16">
          <VesicashBrandLogo />
        </div>

        <div class="title-text h4-text grey-900 mgb-6">
          MoR contract for {{ country_data.country_data.name }}
        </div>

        <div class="meta-text tertiary-1-text grey-600">
          Please read the contract below and enter your name at the bottom to
          sign this contract.
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body pdb-24">
        <!-- INTRODUCTION -->
        <MoRAccordion title="1. Introduction">
          <template slot="card-content">
            <div>
              <p>
                This
                <span class="fw-semibold"
                  >MERCHANT OF RECORD AGREEMENT (“AGREEMENT”)</span
                >
                governs the use of the Service (as defined below).
              </p>

              <p class="fw-semibold">BETWEEN</p>

              <p>
                <span class="fw-semibold">{{ getUser.business_name }}</span>
                (the <span class="fw-semibold">Merchant</span>) a company duly
                incorporated under the Laws of
                <span class="fw-semibold">{{ business_country }}</span
                >, which expression shall where the context so admits, include
                its successors and assigns, of the first part;
              </p>

              <p class="fw-semibold">AND</p>

              <p>
                <span class="fw-semibold"
                  >VESICASH INNOVATIVE TECHNOLOGIES LIMITED</span
                >
                (the “<span class="fw-semibold">Merchant of Record</span>” or
                the “<span class="fw-semibold">MoR”</span>) a company duly
                incorporated under the Laws of
                {{ country_data.country_data.name }},
                <span v-if="getMoRAddress"
                  >having its place of business at {{ getMoRAddress }},</span
                >
                which expression shall where the context so admits, include its
                successors and assigns, of the second part;
              </p>

              <p>
                The <span class="fw-semibold">Merchant</span> and the
                <span class="fw-semibold">Merchant of Record</span> shall be
                collectively referred to as “<span class="fw-semibold"
                  >Parties”</span
                >
                and the word “<span class="fw-semibold">Party”</span> shall be
                construed accordingly.
              </p>

              <div>
                <div class="mgb-8 fw-semibold">WHEREAS</div>

                <ul style="list-style-type: upper-alpha">
                  <li class="mgb-6">
                    The Merchant operates a Business Account on the Vesicash
                    Platform.
                  </li>

                  <li>
                    The Merchant of Record is a company that is engaged in the
                    business of offering payment gateway integration, payment
                    processing, fraud prevention and compliance, payment
                    reconciliation, chargebacks and related services to its
                    Customers.
                  </li>

                  <li>
                    The Merchant wishes to engage the Merchant of Record to
                    provide the services stated in this agreement for all MoR
                    Transactions done on the Vesicash Platform between the
                    Merchant and a Customer within the Territory.
                  </li>

                  <li>
                    Further to the above, the Merchant and the Merchant of
                    Record have agreed to enter into this Agreement to outline
                    the rights and obligations of the Parties and clearly define
                    the terms of their understanding in relation to the Services
                    to be provided by the MoR.
                  </li>

                  <li>
                    This Agreement is effective upon the date the Merchant first
                    accesses or uses the Services (“Effective Date”) and
                    continues until the Merchant or Merchant of Record
                    terminates it (this period, the “Term”).
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </MoRAccordion>

        <MoRAccordion title="2. Definitions & Interpretations">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">2.1.</div>
                <div>
                  The definitions and rules of interpretation in this clause
                  apply in this Agreement:
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Affiliates: </span>means, in
                  relation to any Party, any entity in the same group as that
                  Party, including but not limited to a subsidiary or a holding
                  company of that Party and any direct or indirect subsidiaries
                  of such holding company.
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Agreement: </span>means this
                  Merchant of Record Agreement and any supplements, appendices,
                  amendments, modifications, extensions and revisions therein;
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Applicable Law(s): </span>includes
                  but is not limited to all {{ country_data.country_data.name }}
                  legislation, law, regulation, code, guidelines, rules,
                  policies and directives of any competent regulatory entity,
                  including without limitation requirements with respect to
                  payments, data protection, data privacy and data security, or
                  any successor legislation, law, regulation, code, guidelines,
                  rules, policies and directives amending, consolidating or
                  replacing such Applicable Law, that is applicable to the
                  deployment or operation of the core IT banking solution as
                  well as any Services to be provided with respect to this
                  Agreement;
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Business Account: </span>means a
                  unique personified business account registered in the name of
                  the Merchant and which contains details of the Merchant’s
                  transactions/operations on the Vesicash Platform (as defined
                  below)
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Customer: </span>means a person who
                  pays for goods or services sold by the Merchant.
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">KYC: </span>means Know Your Customer
                  and it refers to the MoR’s processes, procedures, standards
                  and checks for identifying and verifying a merchant’s identity
                  at onboarding and on an ongoing basis, in line with anti-money
                  laundering and regulatory requirements;
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">MoR Transactions: </span>means the
                  transactions that are maintained and settled by the MoR on
                  behalf of the Merchant within the Territory;
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Services: </span>means the Services
                  to be provided by the MoR as further outlined in Clause 4.2 of
                  this Agreement across all the Territories;
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Territory(ies): </span>means
                  Nigeria, Ghana, Rwanda, Zambia and such other countries as the
                  Parties may agree in writing from time to time.
                </div>
              </li>

              <li class="mb-3">
                <div>
                  <span class="fw-semibold">Vesicash Platform: </span>refers
                  collectively to the Vesicash’s Website (<a
                    href="http://www.vesicash.com"
                    >www.vesicash.com</a
                  >) and other related applications provided by Vesicash
                </div>
              </li>

              <li class="mgt-15">
                <div class="counter">2.2.</div>
                <div>
                  In this Agreement, headings embodied in the Clauses are for
                  convenience only and shall not be used in its interpretation.
                  Unless the context of the Agreement indicates a contrary
                  intention:
                </div>
              </li>

              <ol class="custom-sub-li">
                <li>
                  <div class="counter">2.2.1.</div>
                  <div>
                    the singular shall include the plural and vice-versa;
                  </div>
                </li>

                <li>
                  <div class="counter">2.2.2.</div>
                  <div>
                    a reference to anyone gender shall be capable of being
                    construed as a reference of any of the others; and
                  </div>
                </li>

                <li>
                  <div class="counter">2.2.3.</div>
                  <div>
                    a reference to a natural person shall be capable of being
                    construed as a reference to an artificial/legal person and
                    vice versa.
                  </div>
                </li>
              </ol>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="3. Term & Appointment">
          <template slot="card-content">
            <p>
              Subject to Clause (Termination), the term of this Agreement shall
              be for a period of two (2) years (“<span class="fw-semibold"
                >Initial Term</span
              >
              ”) from the Effective Date and is renewable. Upon expiry of the
              Initial Term, this Agreement shall automatically renew for
              successive one (1) year periods until terminated in accordance
              with this Agreement (the “<span class="fw-semibold"
                >Renewal Term</span
              >”).
            </p>

            <p>
              The parties acknowledge and agree that the MoR is hereby appointed
              and shall act as Merchant of Record for MoR Transactions between
              the Merchant and Customers within the Territory and shall be
              responsible for processing payments, reconciling payments,
              honouring refunds and chargebacks, and handling related services
              on behalf of the Merchant. The Merchant of Record shall have
              primary responsibility for the Merchant’s compliance with all
              relevant payment processing regulations and standards, and
              provision of other related services as further described in Clause
              4.2 (Obligations of the Merchant of Record).
            </p>
          </template>
        </MoRAccordion>

        <MoRAccordion title="4. Obligations & Responsibilities of the parties">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">4.1.</div>
                <div>
                  <div class="fw-semibold">Obligations of The Merchant:</div>
                  <div>The Merchant Shall:</div>
                </div>
              </li>

              <ol class="custom-sub-li">
                <li>
                  <div class="counter">4.1.1.</div>
                  <div>Submit all KYC documents to the MoR when requested;</div>
                </li>

                <li>
                  <div class="counter">4.1.2.</div>
                  <div>
                    execute all necessary forms and agreements as may be
                    required from time to time;
                  </div>
                </li>

                <li>
                  <div class="counter">4.1.3.</div>
                  <div>
                    do all such things as are necessary and incidental to the
                    scope of this Agreement; and
                  </div>
                </li>

                <li>
                  <div class="counter">4.1.4.</div>
                  <div>
                    perform such other responsibilities as may be reasonably
                    necessary to fulfil its obligations under this Agreement.
                  </div>
                </li>
              </ol>

              <li>
                <div class="counter">4.2.</div>
                <div>
                  <div class="fw-semibold">
                    Obligations of The Merchant of Record:
                  </div>
                  <div>The MoR Shall:</div>
                </div>
              </li>

              <ol class="custom-sub-li">
                <li>
                  <div class="counter">4.2.1.</div>
                  <div>
                    Work with the payment processor to process Customer payments
                    on behalf of the merchant, including authorising
                    transactions, capturing funds, and settling payments;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.2.</div>
                  <div>
                    use advanced fraud prevention tools and techniques to help
                    merchants reduce the risk of fraudulent transactions;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.3.</div>
                  <div>
                    ensure that merchants comply with all relevant payment
                    processing regulations and standards, and the provision of
                    the Services;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.4.</div>
                  <div>
                    reconcile payments and provides detailed reports to
                    merchants, including transaction details, settlement
                    amounts, and other payment-related data;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.5.</div>
                  <div>
                    implement appropriate privacy practices, with respect to
                    Customer(s’) personal information and uphold relevant data
                    requirements that are applicable in stated Territory;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.6.</div>
                  <div>
                    help merchants manage chargebacks, including dispute
                    resolution and chargeback prevention strategies;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.7.</div>
                  <div>
                    execute all necessary forms and agreements required in
                    fulfilling its obligations under this Agreement;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.8.</div>
                  <div>
                    comply with Applicable Laws, guidelines and standards which
                    this Agreement may be subject;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.9.</div>
                  <div>
                    keep and maintain accurate record of all MoR Transactions;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.10.</div>
                  <div>
                    make itself available for discussions, when necessary;
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.11.</div>
                  <div>
                    fully cooperate with the Broker Partner to carry out their
                    obligations as agreed by the Parties; and
                  </div>
                </li>

                <li>
                  <div class="counter">4.2.12.</div>
                  <div>
                    perform such other responsibilities as may be reasonably
                    necessary to fulfil its obligations under this Agreement.
                  </div>
                </li>
              </ol>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="5. Assignments of Rights and Obligations">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">5.1.</div>
                <div>
                  Neither Party shall be entitled to assign this Agreement or
                  any of its rights and obligations hereunder to any third party
                  without the other Party’s prior written consent, which consent
                  shall not be unreasonably withheld or delayed. As a condition
                  for its validity, the party seeking to effect such assignment
                  shall:
                </div>
              </li>

              <ol class="custom-sub-li">
                <li>
                  <div class="counter">5.1.1.</div>
                  <div>
                    ensure and be responsible for the compliance by any assignee
                    or subcontractor with the terms of this Agreement;
                  </div>
                </li>

                <li>
                  <div class="counter">5.1.2.</div>
                  <div>
                    include in any assignment or subcontract, provisions
                    ensuring compliance by the assignee or subcontractor with
                    the terms and conditions of this Agreement;
                  </div>
                </li>

                <li>
                  <div class="counter">5.1.3.</div>
                  <div>
                    promptly furnish the other party with executed copies of any
                    assignment or subcontract.
                  </div>
                </li>
              </ol>

              <li>
                <div class="counter">5.2.</div>
                <div>
                  Nothing in this Agreement shall be construed to amount to a
                  grant of any power to the MoR to bind the Merchant to any
                  third party whether for the purpose of accomplishing the
                  objectives of this Agreement or whatsoever.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="6. Indemnification">
          <template slot="card-content">
            <p>
              Either Party shall indemnify and hold the other Party, its
              Affiliates, employees and agents harmless from and against any
              damage, loss, expense, claims or liability that Party may incur:
            </p>

            <ol class="custom-li">
              <li>
                <div class="counter">6.1.</div>
                <div>
                  with respect to any negligent act or omission by, or wilful
                  misconduct of, the Party’s employees or agents to the extent
                  however that such negligent act can be situated in the normal
                  course of employment or appointment;
                </div>
              </li>

              <li>
                <div class="counter">6.2.</div>
                <div>
                  as a result of the violation of any Applicable Law, statute or
                  regulation by the Parties or their personnel; and/or
                </div>
              </li>

              <li>
                <div class="counter">6.3.</div>
                <div>
                  in connection with any third party claims, actions, demands
                  and/or losses to the extent that such losses result from any
                  breach of this Agreement by such indemnifying Party.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="7. Proprietary & Confidential Information">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">7.1.</div>
                <div>
                  The Parties anticipate that under this Agreement, it may be
                  necessary for either Party to transfer to the other
                  information of a proprietary or confidential nature (the
                  “Proprietary Information”). Such information shall be clearly
                  identified by the disclosing party at the time of disclosure
                  unless by its contents and nature it would be considered
                  proprietary or confidential by a reasonable person familiar
                  with the subject matter of this Agreement. The Parties
                  acknowledge that any such information is confidential and/or
                  proprietary. The non-disclosing Party further acknowledges
                  that all information disclosed to it by the disclosing party
                  is considered Proprietary Information of the disclosing party.
                </div>
              </li>

              <li>
                <div class="counter">7.2.</div>
                <div>
                  Each Party agrees that it will use all reasonable and prudent
                  efforts to protect the Proprietary Information of the other
                  party. Disclosure of such information shall be restricted to
                  those individuals who are directly participating under this
                  Agreement and as permitted pursuant to clause 8.2.1 below:
                </div>
              </li>

              <ol class="custom-sub-li">
                <li>
                  <div class="counter">7.2.1.</div>
                  <div>
                    Neither Party shall make any reproduction, disclosures or
                    use of the other Party’s Proprietary Information except as
                    follows: (i) Proprietary Information furnished by the
                    non-disclosing Party may be used by the disclosing Party
                    solely in performance of its obligations under this
                    Agreement, and (ii) Proprietary Information may be used as
                    expressly permitted by a written authorisation signed by an
                    officer of the disclosing party.
                  </div>
                </li>

                <li>
                  <div class="counter">7.2.2.</div>
                  <div>
                    Subject to any other agreements between the parties, which
                    shall remain in full force and effect, the limitations on
                    reproduction, disclosure, or use of Proprietary Information
                    shall not apply to, and neither party shall be liable for
                    reproduction, disclosure, or use of, Proprietary Information
                    with respect to which any of the following conditions
                    exists:
                  </div>
                </li>

                <ol class="custom-sub-li custom-inner-sub-li">
                  <li>
                    <div class="counter">7.2.2.1.</div>
                    <div>
                      Prior to the receipt thereof under this Agreement, it has
                      been developed independently by the Party receiving it, or
                      was lawfully known to the Party receiving it, or has been
                      lawfully received from other sources, including the
                      disclosing party, provided that such other source did not
                      receive it due to a breach of this Agreement or any other
                      agreement between the Parties.
                    </div>
                  </li>

                  <li>
                    <div class="counter">7.2.2.2.</div>
                    <div>
                      Subsequent to the receipt of such Proprietary Information
                      under this Agreement (a) it is published by the disclosing
                      party or is disclosed by the disclosing party to third
                      parties, without restriction; (b) it has been lawfully
                      obtained by the Party receiving it from other sources,
                      without restriction, provided that such other source did
                      not receive it due to a breach of this Agreement or any
                      other agreement between the Parties; or (c) if such
                      information otherwise comes within the public knowledge or
                      becomes generally known to the public without fault of the
                      receiving party
                    </div>
                  </li>
                </ol>
              </ol>

              <li>
                <div class="counter">7.3.</div>
                <div>
                  Neither the execution and delivery of this Agreement nor the
                  disclosure of any Proprietary Information by either Party to
                  the other shall be construed as granting to the other party
                  either expressly, by implication, estoppel, or otherwise, any
                  license for any purpose under any invention, patent,
                  trademark, or copyright now or thereafter owned or controlled
                  by the disclosing party.
                </div>
              </li>

              <li>
                <div class="counter">7.4.</div>
                <div>
                  Notwithstanding the expiration of the other provisions of this
                  Agreement, the obligations, and provisions of this clause
                  shall continue unless terminated in writing by both Parties.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="8. Intellectual Property">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">8.1.</div>
                <div>
                  It is mutually agreed that neither Party shall acquire
                  directly or by implication, any rights in any intellectual
                  property of the other Party under this Agreement, including,
                  but not limited to copyrights in works, patents including
                  software or hardware, any license under any invention, patent,
                  trademark or any similar rights (collectively “Intellectual
                  Property”) created prior to the date of this Agreement or
                  thereafter individually.
                </div>
              </li>

              <li>
                <div class="counter">8.2.</div>
                <div>
                  Each Party shall maintain exclusive ownership of all
                  intellectual property rights in its website, application, and
                  software utilised for the purpose of this Agreement.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="9. Warranty and Indemnity">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">9.1.</div>
                <div>
                  Each Party to this Agreement acknowledges and agrees that
                  nothing contained herein shall be construed to constitute
                  either party as an agent of the other;
                </div>
              </li>

              <li>
                <div class="counter">9.2.</div>
                <div>
                  Each Party warrants that it possesses the requisite licenses,
                  permits, authorisations, and/or registrations required to
                  perform their respective obligations under this Agreement.
                </div>
              </li>

              <li>
                <div class="counter">9.3.</div>
                <div>
                  Each Party agrees to indemnify and hold harmless the other
                  Party and each of its officers, directors, shareholders,
                  employees, representatives, agents, successors and assigns
                  from and against all claims of third parties acting on its
                  instructions, and all associated losses, to the extent arising
                  out of that Party’s gross negligence or wilful misconduct in
                  performing any of its obligations under this Agreement, or a
                  breach of its representations, warranties, covenants or
                  agreements under this Agreement.
                </div>
              </li>

              <li>
                <div class="counter">9.4.</div>
                <div>
                  Each Party agrees to defend the other Party against any such
                  liability, claim or demand.
                </div>
              </li>

              <li>
                <div class="counter">9.5.</div>
                <div>
                  Each Party agrees to notify the other Party promptly of any
                  written claims or demand against the Party.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="10. Governing Law & Dispute Resolution">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">10.1.</div>
                <div>
                  This Agreement shall be governed by and construed in
                  accordance with the Laws of the Federal Republic of Nigeria.
                </div>
              </li>

              <li>
                <div class="counter">10.2.</div>
                <div>
                  Any disputes arising under or in connection with the validity,
                  interpretation and performance of this Agreement that cannot
                  be resolved amicably by the Parties shall be brought before a
                  negotiator agreed to by the Parties for settlement and in the
                  event, such settlement is not reached within 30 (thirty) days
                  of such dispute being referred to the negotiator then the
                  dispute shall be resolved by arbitration in accordance with
                  the Arbitration and Conciliation Act, Cap A18, Laws of the
                  Federal Republic of Nigeria 2004 before a single arbitrator.
                </div>
              </li>

              <li>
                <div class="counter">10.3.</div>
                <div>
                  The Parties shall endeavour in good faith to mutually agree on
                  the selection of an arbitrator. If the Parties cannot mutually
                  agree on the selection of an arbitrator within ten (10) days
                  of the request for arbitration, they shall apply to the Lagos
                  Court of Arbitration to appoint an arbitrator. Arbitration
                  proceedings shall be conducted in Lagos. The arbitrator will
                  be requested to render an award within ninety (90) days and to
                  provide, in writing, the reasoning for the award. The decision
                  of any such arbitrator shall be final and binding on the
                  parties.
                </div>
              </li>

              <li>
                <div class="counter">10.4.</div>
                <div>
                  Each Party shall bear such Party’s cost in connection with the
                  Arbitration and the arbitrator’s fees shall be split equally
                  between the Parties.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="11. Termination">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">11.1.</div>
                <div>
                  Either Party may terminate this Agreement by giving notice in
                  writing to the other Party if the other Party takes any step
                  or action in connection with its entering administration,
                  provisional liquidation or any composition or arrangement with
                  its creditors (other than in relation to a solvent
                  restructuring), being wound up (whether voluntarily or by
                  order of the court, unless for the purpose of a solvent
                  restructuring), having a receiver appointed to any of its
                  assets or ceasing to carry on business or, if the step or
                  action is taken in another jurisdiction, in connection with
                  any analogous procedure in the relevant jurisdiction
                </div>
              </li>

              <li>
                <div class="counter">11.2.</div>
                <div>
                  This Agreement may also be terminated by any of the Parties by
                  a written notice to the other, if the other Party is in
                  material breach of the terms of this Agreement and has failed
                  to rectify such breach (in the case of a breach capable of
                  being remedied) within fifteen (15) Business Days of receiving
                  a written notice requiring it to do so.
                </div>
              </li>

              <li>
                <div class="counter">11.3.</div>
                <div>
                  Either Party may terminate this Agreement at any time by
                  giving 1 (one) month written notice to the other Party.
                </div>
              </li>

              <li>
                <div class="counter">11.4.</div>
                <div>
                  Upon Termination, the Parties shall be discharged from any
                  liability for further performance of its obligations under
                  this Agreement.
                </div>
              </li>

              <li>
                <div class="counter">11.5.</div>
                <div>
                  A termination of this Agreement shall not affect any accrued
                  rights or liabilities of any of the Parties nor the coming
                  into force or the continuance of any provision which is
                  expressly or by implication intended to come into or continue
                  upon n or after such termination.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="12. Relationship of The Parties">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">12.1.</div>
                <div>
                  The Parties are independent contractors, and neither shall act
                  as the other’s agent, except as expressly agreed to in writing
                  and only in relation to the Project, nor shall either Party be
                  deemed an agent of the other nor shall this Agreement be
                  interpreted as creating an employment relationship,
                  partnership or joint venture or otherwise.
                </div>
              </li>

              <li>
                <div class="counter">12.2.</div>
                <div>
                  Neither Party shall incur any obligation on the other’s
                  behalf, nor commit the other in any manner without the other’s
                  prior written consent.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="13. Limitation of Liability">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">13.1.</div>
                <div>
                  The liability of the MoR to the Merchant, whether in contract,
                  negligence, and other tort, by way of indemnity or otherwise
                  arising out of or in connection with this Agreement shall be
                  subject to the financial limits set out below:
                </div>
              </li>

              <ol class="custom-sub-li">
                <li>
                  <div class="counter">13.1.1.</div>
                  <div>
                    No liability shall be raised against the MoR more than one
                    (1) year after the accrual of the cause of such liability,
                    therefore. It is further agreed that the limitations on
                    liability, expressed herein, shall inure to the benefit of
                    and apply to all parents (both direct and indirect),
                    subsidiaries and Affiliates of the MoR.
                  </div>
                </li>

                <li>
                  <div class="counter">13.1.2.</div>
                  <div>
                    The MoR will not be liable for the actions or inactions of
                    any third party not acting on the instructions of the MoR;
                    neither will the MoR be liable for the actions or inactions
                    not directly traceable to it.
                  </div>
                </li>
              </ol>
            </ol>
          </template>
        </MoRAccordion>

        <MoRAccordion title="14. Miscellaneous">
          <template slot="card-content">
            <ol class="custom-li">
              <li>
                <div class="counter">14.1.</div>
                <div>
                  <span class="fw-semibold">Good Faith: </span>Subject to the
                  terms and conditions of this Agreement, each Party shall act
                  in good faith and devote its best efforts to take or cause to
                  be taken, all action, and to do, or cause to be done, all
                  things necessary, proper or advisable under applicable laws
                  and regulations to consummate and make effective the
                  transactions contemplated by this Agreement.
                </div>
              </li>

              <li>
                <div class="counter">14.2.</div>
                <div>
                  <span class="fw-semibold">Amendment & Modification: </span
                  >This Agreement may be amended, modified, or supplemented only
                  by the written agreement of both Parties.
                </div>
              </li>

              <li>
                <div class="counter">14.3.</div>
                <div>
                  <span class="fw-semibold">Survival: </span>Notwithstanding the
                  provisions in clauses 6 (Proprietary & Confidential
                  Information), 7 (Intellectual Property), and 14 (Governing Law
                  & Dispute Resolution) shall survive such termination.
                </div>
              </li>

              <li>
                <div class="counter">14.4.</div>
                <div>
                  <span class="fw-semibold"
                    >Waiver of Compliance & Consents: </span
                  >Except as otherwise provided in this Agreement, any failure
                  of any of the Parties to comply with any obligation, covenant,
                  agreement, or condition may be waived by the Party entitled to
                  the benefits by the Party granting such waiver, but such
                  waiver or failure to insist upon strict compliance with such
                  obligation, covenant, agreement or condition shall not operate
                  as a waiver of any subsequent obligation or other failure.
                </div>
              </li>

              <li>
                <div class="counter">14.5.</div>
                <div>
                  <span class="fw-semibold">Notices: </span>Any notice or other
                  communication required or permitted under this Agreement may
                  be addressed to the recipient at its address given above, or
                  such other address as that party may provide from time to
                  time, and shall be deemed duly given (i) when delivered, if by
                  hand delivery; (ii) within the hour if by email without an
                  email failure delivery notification received by the sender or
                  any evidence to the contrary; and (ii) if otherwise delivered,
                  when written confirmation of receipt thereof is obtained (a)
                  from the recipient; or (b) from the mail courier.
                </div>
              </li>

              <li>
                <div class="counter">14.6.</div>
                <div>
                  <span class="fw-semibold">Entire Agreement: </span>This
                  Agreement contains the entire agreement between the Parties
                  with respect to the subject matter of this Agreement and
                  supersedes all prior arrangements or understandings (whether
                  written or oral) with respect thereto.
                </div>
              </li>

              <li>
                <div class="counter">14.7.</div>
                <div>
                  <span class="fw-semibold">Severability: </span>If any
                  provision in this Agreement is held to be invalid or
                  unenforceable in any jurisdiction, the validity and
                  enforceability of all remaining provisions contained in this
                  Agreement shall not in any way be affected or impaired, and
                  the invalid or unenforceable provisions shall be interpreted
                  and applied so as to produce as near as may be the economic
                  result intended by the Parties to this Agreement.
                </div>
              </li>

              <li>
                <div class="counter">14.8.</div>
                <div>
                  <span class="fw-semibold">Signature: </span> By signing below,
                  each Party indicates acceptance of the terms of this Agreement
                  in its entirety as of the date first written above and
                  represents and warrants to the other Party that it understands
                  this Agreement and that to each Party’s knowledge, no law or
                  third-party obligation prevents it from entering into and
                  performing this Agreement in full. For the convenience of the
                  Parties, this agreement may be executed electronically and in
                  counterparts. The electronic execution shall be binding, and
                  each counterpart shall be binding, and all of them shall
                  constitute one and the same instrument.
                </div>
              </li>
            </ol>
          </template>
        </MoRAccordion>

        <!-- FULLNAME INPUT -->
        <div class="form-group mgt-24">
          <FormFieldInput
            label_title="Enter your full name to sign"
            label_id="fullName"
            is_required
            placeholder="Your full name"
            :input_value="getFormFieldValueMx(form, 'fullname')"
            @getInputState="updateFormFieldMx($event, 'fullname')"
            :error_handler="{
              type: 'minimum',
              minimum: 2,
              message: 'Full name should contain 2 words',
            }"
          />
        </div>

        <!-- TERMS AND CONDITION -->
        <div class="form-group">
          <div class="d-flex justify-content-start align-items-center">
            <input
              type="checkbox"
              v-model="form['accept_terms'].value"
              class="mgr-10"
            />

            <div class="tertiary-2-text grey-900">
              I agree to the terms and conditions
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer grey-10-bg">
        <button
          class="btn btn-md btn-secondary"
          @click="$emit('closeTriggered')"
        >
          Cancel
        </button>

        <button
          class="btn btn-md btn-primary"
          ref="btnRef"
          @click="signMoRDoc"
          :disabled="isFormValidated"
        >
          {{ getButtonText }}
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";
import MoRAccordion from "@/modules/merchant-of-records/modules/config/components/mor-accordion";

export default {
  name: "MoRContractModal",

  components: {
    ModalCover,
    VesicashBrandLogo,
    MoRAccordion,
  },

  props: {
    country_data: {
      type: Object,
    },
  },

  computed: {
    getButtonText() {
      return this.button_text;
    },

    isFormValidated() {
      const isSigned = ["pending", "verified"].includes(
        this.country_data.status
      );

      if (isSigned) {
        this.button_text =
          this.country_data.status === "pending" ? "Signed" : "Verified";
        return true;
      }

      return this.validateFormFieldMx(this.form);
    },

    getMoRAddress() {
      return this.locations[this.country_data.country_data.name.toLowerCase()];
    },
  },

  watch: {
    "form.accept_terms.value": {
      handler(value) {
        this.form.accept_terms.validated = value ? true : false;
      },
    },
  },

  data() {
    return {
      button_text: "Confirm signature",
      business_country: null,

      form: {
        fullname: {
          validated: true,
          value: "",
        },
        accept_terms: {
          validated: false,
          value: false,
        },
      },

      locations: {
        nigeria: "16 Mudashiru Eletu Way, Osapa Estate, Nigeria",
        ghana:
          "The Enterprise Village, 7 Tunemete Street, Accra-Ghana (Near Perez Chapel – Dworwulu Junction)",
        rwanda: "Remera, Gasabo, Umujyi wa Kigali, Rwanda",
        egypt: "24 Al Tayaran Street, Nasr City, Cairo, Egypt",
        zambia: "LN2260/27 Off Lilayi Road, Shaft Five, Kafue, Zambia",
        kenya: "",
      },
    };
  },

  mounted() {
    const base_country_data = this.$storage.getStorage({
      storage_name: "base_country_data",
      storage_type: "object",
    });

    this.business_country = base_country_data.country ?? null;
    this.form.fullname.value = this.getUser.fullname;

    const isSigned = ["pending", "verified"].includes(this.country_data.status);

    if (isSigned) {
      this.form.accept_terms.value = true;
      this.form.accept_terms.validated = true;
    }
  },

  methods: {
    signMoRDoc() {
      this.$bus.$emit("signedMoR", this.country_data);
      this.$emit("closeTriggered");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-header {
  @include breakpoint-down(sm) {
    padding: toRem(20) toRem(16) 0;
  }

  .brand-logo {
    svg {
      width: toRem(170);
      height: auto;

      @include breakpoint-down(lg) {
        width: toRem(150);
      }

      @include breakpoint-down(sm) {
        width: toRem(135);
      }
    }
  }

  .title-text {
    font-size: toRem(22);

    @include breakpoint-down(lg) {
      font-size: toRem(20);
    }

    @include breakpoint-down(sm) {
      font-size: toRem(18);
    }
  }

  .meta-text {
    font-size: toRem(15);

    @include breakpoint-down(lg) {
      font-size: toRem(14);
    }

    @include breakpoint-down(sm) {
      font-size: toRem(13.5);
    }
  }
}

.modal-cover-body {
  max-height: 65vh;
  overflow: auto;

  @include breakpoint-down(lg) {
    max-height: 60vh;
  }

  @include breakpoint-down(md) {
    max-height: 58vh;
  }

  ul,
  ol {
    padding-left: toRem(22);

    li {
      margin-bottom: toRem(8);
    }
  }

  .custom-li,
  .custom-sub-li,
  .custom-inner-sub-li {
    list-style-type: none;
    padding-left: toRem(2);

    li {
      @include flex-row-nowrap("flex-start", "flex-start");

      .counter {
        font-weight: 600;
        min-width: toRem(38);
        width: auto;
      }
    }
  }

  .custom-sub-li {
    padding-left: toRem(38);
    margin-bottom: toRem(18) !important;

    &:last-of-type {
      margin-bottom: 0;
    }

    .counter {
      min-width: toRem(52) !important;
    }
  }

  .custom-inner-sub-li {
    padding-left: toRem(54);

    .counter {
      min-width: toRem(64) !important;
    }
  }
}

.modal-cover-footer {
  @include flex-row-nowrap("flex-end", "center");
  border-radius: 0 0 toRem(24) toRem(24);
  padding: toRem(24) toRem(26);
  gap: toRem(24);

  .btn {
    padding: toRem(9) toRem(30);
  }
}
</style>

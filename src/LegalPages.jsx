import "./LegalPages.css";

const LAST_UPDATED = "October 13, 2026";

export default function LegalPages({ page }) {
  const isPrivacy = page === "privacy-policy";

  return (
    <div className="legal-shell">
      <header className="legal-header">
        <a className="legal-brand" href="#/">
          <span className="legal-brand-mark">FL</span>
          <span>
            FundLens<span className="legal-brand-dot">.</span>
          </span>
        </a>
        <a className="legal-back" href="#/">
          ← Back to portfolio
        </a>
      </header>

      <main className="legal-content">
        <div className="legal-eyebrow">
          <span />
          {isPrivacy ? "YOUR DATA & PRIVACY" : "IMPORTANT INFORMATION"}
        </div>

        <h1>{isPrivacy ? "Privacy Policy" : "Disclaimer"}</h1>
        <p className="legal-intro">
          {isPrivacy
            ? "This policy explains what information this website displays, what information may be collected, and how it is handled."
            : "Please read this disclaimer carefully before using or relying on any information displayed on this website."}
        </p>

        <div className="legal-meta">
          <span>Last updated: {LAST_UPDATED}</span>
          <span>Personal US Equity Journal</span>
        </div>

        {isPrivacy ? <PrivacyContent /> : <DisclaimerContent />}

        <div className="legal-contact">
          <h2>Questions or requests?</h2>
          <p>
            For privacy-related requests or questions about this page, contact
            the website owner using the contact details below.
          </p>
          <p>
            <strong>Contact email:</strong>{" "}
            <a href="mailto:youaroundtech[at]gmail[dot]com">
              youaroundtech[@]gmail[dot]com
            </a>
          </p>
        </div>

        <div className="legal-bottom-nav">
          <a href="#/">← Return to portfolio</a>
          <a href={isPrivacy ? "#/disclaimer" : "#/privacy-policy"}>
            {isPrivacy ? "Read Disclaimer →" : "Read Privacy Policy →"}
          </a>
        </div>
      </main>

      <footer className="legal-footer">
        <span>FundLens · PERSONAL US EQUITY JOURNAL</span>
        <span>Information only · Not investment advice</span>
      </footer>
    </div>
  );
}

function DisclaimerContent() {
  return (
    <article className="legal-article">
      <section>
        <h2>1. Purpose of this website</h2>
        <p>
          This website is a personal stock-tracking journal intended to document
          and display selected US equity holdings, past trades, transaction
          dates, prices, holding periods, comments, and percentage returns.
        </p>
        <p>
          It is provided for informational, educational, and record-keeping
          purposes only. It is not intended to be an investment service, trading
          service, or a substitute for independent financial research.
        </p>
      </section>

      <section>
        <h2>2. No investment advice or recommendations</h2>
        <p>
          The website owner is not acting as an investment adviser, research
          analyst, broker, dealer, portfolio manager, or other securities market
          intermediary through this journal. The owner does not represent that
          they are registered with the Securities and Exchange Board of India
          (SEBI) or any other financial regulator.
        </p>
        <p>
          Nothing on this website constitutes or should be interpreted as a
          recommendation, solicitation, offer, or advice to buy, sell, hold,
          short, or otherwise transact in any security or financial instrument,
          for either the short term or the long term.
        </p>
        <p>
          The appearance of a ticker, price, holding, past transaction,
          percentage return, or comment does not indicate that the owner
          recommends that security or transaction to any visitor.
        </p>
      </section>

      <section>
        <h2>3. No reliance or assurance of returns</h2>
        <p>
          Visitors must not rely on this journal as the basis for making
          investment or trading decisions. The information does not take account
          of any visitor's financial circumstances, investment objectives,
          knowledge, experience, liquidity needs, or risk tolerance.
        </p>
        <p>
          There is no assurance or guarantee of profit, performance, capital
          preservation, or any particular outcome. Past performance is not
          indicative of future results. A stock that has generated a gain
          previously may incur a loss in the future.
        </p>
      </section>

      <section>
        <h2>4. Independent decisions and risk</h2>
        <p>
          Every visitor is solely responsible for their own research,
          assessment, decisions, orders, and transactions. Any decision to act
          on information seen here is made independently and at the visitor's
          own discretion and risk.
        </p>
        <p>
          To the extent permitted by applicable law, the website owner disclaims
          responsibility for trading or investment losses, lost profits, or
          other consequences arising from a visitor's use of, interpretation of,
          or reliance on this journal.
        </p>
        <p>
          Nothing in this disclaimer excludes or limits any liability where such
          exclusion or limitation is prohibited by applicable law.
        </p>
      </section>

      <section>
        <h2>5. Accuracy, completeness, and delays</h2>
        <p>
          Data may be entered manually or obtained from a spreadsheet. Prices,
          dates, holding periods, comments, and calculated returns may be
          incomplete, delayed, inaccurate, outdated, or affected by data-entry
          or calculation errors.
        </p>
        <p>
          Displayed market prices may not be live or executable prices. Figures
          may not account for commissions, fees, taxes, foreign exchange
          effects, corporate actions, slippage, or other costs. The website
          owner does not undertake to correct or update every item immediately.
        </p>
      </section>

      <section>
        <h2>6. No affiliation or endorsement</h2>
        <p>
          Unless expressly stated otherwise, this website is an independent
          personal project. The owner is not affiliated with, endorsed by,
          sponsored by, or acting on behalf of SEBI, any stock exchange,
          brokerage, listed company, financial institution, or capital markets
          intermediary.
        </p>
        <p>
          Company names, ticker symbols, and other third-party names are used
          only to identify securities or relevant entities.
        </p>
      </section>

      <section>
        <h2>7. Third-party services and external information</h2>
        <p>
          This website may rely on services such as GitHub Pages for hosting and
          Google Sheets or Google Apps Script for displaying data and handling
          subscriptions. These services may be subject to their own terms,
          availability, and privacy practices.
        </p>
        <p>
          External links, if provided, are for convenience only. The website
          owner does not control and is not responsible for the content,
          accuracy, availability, or policies of third-party websites.
        </p>
      </section>

      <section>
        <h2>8. No professional relationship</h2>
        <p>
          Visiting this website or subscribing to updates does not create an
          adviser-client, broker-client, fiduciary, or other professional
          relationship between the visitor and the website owner.
        </p>
      </section>

      <section>
        <h2>9. Changes to this disclaimer</h2>
        <p>
          This disclaimer may be revised when the website, its features, or
          applicable requirements change. The updated version will be published
          on this page with a revised update date.
        </p>
      </section>

      <section>
        <h2>10. Governing law</h2>
        <p>
          This disclaimer is intended to be read consistently with applicable
          laws of India. Any question about its interpretation or enforceability
          is subject to applicable law and the jurisdiction of competent courts.
        </p>
      </section>

      <p className="legal-emphasis">
        In short: this website is a journal, not a signal service. Do your own
        research and make your own decisions.
      </p>
    </article>
  );
}

function PrivacyContent() {
  return (
    <article className="legal-article">
      <section>
        <h2>1. Scope of this policy</h2>
        <p>
          This Privacy Policy applies to the FundLens Personal US Equity Journal
          website and its subscription feature. It describes the information
          displayed by the website, information submitted by visitors, and the
          ways that information may be processed.
        </p>
      </section>

      <section>
        <h2>2. Information displayed on the website</h2>
        <p>
          The portfolio page may display stock ticker symbols, buy and sell
          dates, buy and sell prices, current prices, percentage returns,
          holding periods, comments, and the date the data was last updated.
        </p>
        <p>
          The site is designed not to display share quantities or the total
          current portfolio value. However, the ticker-level data that is
          displayed is publicly accessible to anyone who can access the website.
          Do not place confidential or sensitive information in public
          spreadsheet fields.
        </p>
      </section>

      <section>
        <h2>3. Information you provide</h2>
        <p>
          If you use the Subscribe feature, you may submit your email address.
          The website uses it to record your subscription request. Do not submit
          information that is not required for this purpose.
        </p>
        <p>
          At present, the subscription feature is intended to store subscription
          records. Submitting an email address does not necessarily mean that
          newsletters or other messages will be sent. Any future use for sending
          updates should be explained clearly before those messages are sent.
        </p>
      </section>

      <section>
        <h2>4. How information is stored and processed</h2>
        <p>
          Portfolio data is retrieved from a Google Apps Script web app
          connected to a Google Sheet. Subscription requests may be processed by
          Google Apps Script and saved in a Subscriptions worksheet in Google
          Sheets.
        </p>
        <p>
          The website is hosted on GitHub Pages. GitHub and Google may process
          technical information as part of providing their services, subject to
          their own terms and privacy policies. The website owner does not
          control the internal processing carried out by those service
          providers.
        </p>
      </section>

      <section>
        <h2>5. Purpose of processing</h2>
        <p>Information may be used to:</p>
        <ul>
          <li>Display the portfolio journal and its trading records.</li>
          <li>Receive and maintain email subscription requests.</li>
          <li>Prevent duplicate subscription entries.</li>
          <li>Respond to privacy requests or technical issues.</li>
          <li>Maintain, protect, and troubleshoot the website.</li>
        </ul>
        <p>
          The owner does not intend to sell subscriber email addresses.
          Information should not be used for unrelated purposes without an
          appropriate basis and, where required, notice or consent.
        </p>
      </section>

      <section>
        <h2>6. Cookies, analytics, and tracking</h2>
        <p>
          The website's application code does not intentionally set advertising
          cookies or run a behavioural advertising profile. However, the hosting
          provider or other integrated services may use technical logs, cookies,
          or similar technologies under their own policies. This website does
          not promise that all provider-level logging is disabled.
        </p>
      </section>

      <section>
        <h2>7. Sharing and disclosure</h2>
        <p>
          Subscriber information may be processed by Google as necessary to
          operate the spreadsheet and Apps Script workflow. Technical
          information may also be processed by the hosting provider.
        </p>
        <p>
          The owner does not intend to sell or rent subscriber email addresses.
          Information may also be disclosed where required by applicable law or
          where reasonably necessary to address security, abuse, or legal
          claims.
        </p>
      </section>

      <section>
        <h2>8. Retention and deletion</h2>
        <p>
          Subscription information may be retained while it is needed to
          maintain the subscription record, administer the service, or meet
          applicable legal requirements. The owner should delete information
          that is no longer reasonably required, subject to applicable
          obligations.
        </p>
        <p>
          You may request access to, correction of, or deletion of your
          subscription email by contacting the website owner. The owner will
          review and respond to requests subject to identity verification where
          appropriate and applicable legal requirements.
        </p>
      </section>

      <section>
        <h2>9. Security</h2>
        <p>
          Reasonable steps should be taken to protect subscription records,
          including restricting access to the underlying Google Sheet and Google
          account. No website, internet transmission, or storage system can be
          guaranteed to be completely secure.
        </p>
        <p>
          The public portfolio endpoint is intended to expose only information
          suitable for public viewing. Do not store passwords, account
          identifiers, private financial documents, or subscriber information in
          data returned by that endpoint.
        </p>
      </section>

      <section>
        <h2>10. International processing</h2>
        <p>
          GitHub and Google may process or store information in locations
          outside your state or country. Their handling of data is subject to
          their applicable terms and privacy policies and relevant law.
        </p>
      </section>

      <section>
        <h2>11. Children's privacy</h2>
        <p>
          This website is intended for a general audience interested in
          financial record-keeping. It is not designed to collect personal
          information from children. Please do not submit another person's email
          address without appropriate authority.
        </p>
      </section>

      <section>
        <h2>12. Your choices and applicable rights</h2>
        <p>
          You may choose not to subscribe. You may also contact the owner to
          request deletion or correction of the email address you submitted.
          Applicable privacy rights and the process for exercising them may
          depend on the law applicable to you.
        </p>
      </section>

      <section>
        <h2>13. Changes to this policy</h2>
        <p>
          This policy may be updated if the website's features, service
          providers, or legal requirements change. The latest version will be
          published on this page with an updated date.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>
          For questions, corrections, deletion requests, or privacy concerns,
          contact the website owner using the email address provided below this
          policy.
        </p>
      </section>
    </article>
  );
}

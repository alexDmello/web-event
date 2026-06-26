import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageBanner } from '../components/PageBanner';
import styles from './Enquire.module.css';

export const Enquire: React.FC = () => {
  // Form submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    proposedDate: '',
    celebrationType: 'Wedding Planning',
    guestCount: '',
    location: ''
  });
  const [otherCelebrationDetail, setOtherCelebrationDetail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // Map element ids to data fields
    const keyMap: Record<string, string> = {
      'client-name': 'fullName',
      'client-email': 'email',
      'client-phone': 'phone',
      'event-date': 'proposedDate',
      'event-type': 'celebrationType',
      'guest-count': 'guestCount',
      'event-location': 'location'
    };

    const field = keyMap[id];
    if (field) {
      if (field === 'phone') {
        // Enforce only digits, stripping leading country code (91) or leading zero (0)
        let digits = value.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);
        setFormData(prev => ({ ...prev, [field]: digits }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Validation
    const { fullName, email, phone, proposedDate, celebrationType, guestCount, location } = formData;
    if (!fullName || !email || !phone || !proposedDate || !celebrationType || !guestCount || !location) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (celebrationType === 'Other' && !otherCelebrationDetail.trim()) {
      setErrorMessage('Please specify your celebration type.');
      setIsSubmitting(false);
      return;
    }

    if (phone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          phone: `+91 ${phone}`,
          proposedDate,
          celebrationType: celebrationType === 'Other' ? `Other: ${otherCelebrationDetail}` : celebrationType,
          guestCount: Number(guestCount),
          location
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting enquiry form:', err);
      setErrorMessage(err.message || 'Failed to submit form. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="enquire-page-container">
      {/* PAGE BANNER */}
      <PageBanner
        title="Enquire"
        description="Tell us about your celebration"
      />

      {/* ENQUIRE WRAPPER */}
      <section className={`${styles.enquireSectionWrapper} reveal-on-scroll`}>
        <div className={styles.enquireSplitLayout}>

          {/* Left Column: Contact details and links */}
          <div className={styles.enquireContactColumn}>
            <span className={styles.enquireSubTitle}>Contact & Socials</span>
            <h2 className={styles.enquireMainTitle}>Get in Touch</h2>
            <p className={styles.enquireDesc}>
              To start planning your signature event, please complete our detailed planning questionnaire on the right. Alternatively, feel free to reach out directly via phone, email, or explore our curated profile listings.
            </p>

            <div className={styles.enquireContactDetails}>
              <div className={styles.contactDetailItem}>
                <span className={styles.detailLabel}>WhatsApp & Call</span>
                <a href="https://wa.me/919148990266" target="_blank" rel="noopener noreferrer" className={styles.detailLink}>+91 91489 90266</a>
              </div>
              <div className={styles.contactDetailItem}>
                <span className={styles.detailLabel}>Email Inquiry</span>
                <a href="mailto:thetaaffeiteevents@gmail.com" className={styles.detailLink}>thetaaffeiteevents@gmail.com</a>
              </div>
            </div>

            <div className={styles.enquireSocialList}>
              <span className={styles.socialListTitle}>Explore Our Work</span>
              <ul className={styles.socialLinksGrid}>
                <li><a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://www.wedmegood.com/profile/Taaffeite-Events-25042588?srsltid=AfmBOop_bgaeRe3LCx6eg9jacDSxhOKk-9glpzOU3wzwjiCIgl-829hI" target="_blank" rel="noopener noreferrer">WedMeGood</a></li>
                <li><a href="https://www.linkedin.com/company/taaffeiteevents/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://ar.pinterest.com/thetaaffeiteevents/_created/" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
                <li><a href="https://www.youtube.com/@Taaffeiteevents" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Form or Success message */}
          <div className={styles.enquireFormColumn}>
            {!isSubmitted ? (
              <>
                <span className={styles.enquireSubTitle}>Plan Your Celebration</span>
                <h2 className={styles.enquireMainTitle}>Planning Questionnaire</h2>

                {errorMessage && (
                  <div className="error-message" style={{
                    color: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    border: '1px solid rgba(231, 76, 60, 0.2)',
                    padding: '12px 16px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>⚠️</span> {errorMessage}
                  </div>
                )}

                <form className={styles.luxuryForm} id="enquire-form" onSubmit={handleSubmit}>
                  {/* Row 1 */}
                  <div className={`${styles.formRow} ${styles.twoCols}`}>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-name">Your Full Name *</label>
                      <input
                        type="text"
                        id="client-name"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Eleanor Vance"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-email">Email Address *</label>
                      <input
                        type="email"
                        id="client-email"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. eleanor@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className={`${styles.formRow} ${styles.twoCols}`}>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-phone">Phone / WhatsApp Number *</label>
                      <div className="phone-input-wrapper" style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: isPhoneFocused ? '1px solid var(--color-charcoal)' : '1px solid rgba(197, 160, 89, 0.3)',
                        transition: 'border-color 0.25s ease'
                      }}>
                        <span className="phone-prefix" style={{
                          padding: '10px 0',
                          fontSize: '1rem',
                          color: 'var(--color-charcoal)',
                          marginRight: '8px',
                          opacity: 0.8,
                          userSelect: 'none'
                        }}>+91</span>
                        <input
                          type="tel"
                          id="client-phone"
                          required
                          disabled={isSubmitting}
                          placeholder="98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setIsPhoneFocused(true)}
                          onBlur={() => setIsPhoneFocused(false)}
                          style={{
                            borderBottom: 'none',
                            flex: 1,
                            padding: '10px 0'
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="event-date">Proposed Date *</label>
                      <input
                        type="date"
                        id="event-date"
                        required
                        disabled={isSubmitting}
                        value={formData.proposedDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={`${styles.formRow} ${styles.twoCols}`}>
                    <div className={styles.formGroup}>
                      <label htmlFor="event-type">Celebration Type *</label>
                      <select
                        id="event-type"
                        required
                        disabled={isSubmitting}
                        value={formData.celebrationType}
                        onChange={handleChange}
                      >
                        <option value="Wedding Planning">Wedding Celebration</option>
                        <option value="Pre-Wedding Celebration">Pre-Wedding (Sangeet, Haldi, Mehendi)</option>
                        <option value="Milestone Birthday">Milestone Birthday / Party</option>
                        <option value="Bespoke Private Event">Bespoke Private Event</option>
                        <option value="Destination Celebration">Destination Wedding / Celebration</option>
                        <option value="Other">Others</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="guest-count">Estimated Guest Count *</label>
                      <input
                        type="number"
                        id="guest-count"
                        required
                        disabled={isSubmitting}
                        min="1"
                        placeholder="e.g. 150"
                        value={formData.guestCount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Row 4: Specify Celebration Type (Conditional) */}
                  <div className={`${styles.conditionalFormRow} ${formData.celebrationType === 'Other' ? styles.show : ''}`}>
                    <div className={styles.formGroup}>
                      <label htmlFor="other-celebration-detail">Specify Celebration Type *</label>
                      <input
                        type="text"
                        id="other-celebration-detail"
                        required={formData.celebrationType === 'Other'}
                        disabled={isSubmitting}
                        placeholder="e.g. Corporate Anniversary Gala, Proposal, Baby Shower"
                        value={otherCelebrationDetail}
                        onChange={(e) => setOtherCelebrationDetail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="event-location">Proposed Location / City *</label>
                      <input
                        type="text"
                        id="event-location"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Bangalore, India"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formSubmitContainer}>
                    <button type="submit" className={styles.btnFormSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Form Success Message */
              <div className={styles.formSuccessMessage} id="form-success">
                <h3>Thank You, {formData.fullName}</h3>
                <p>
                  Your inquiry for the <strong>{formData.celebrationType === 'Other' ? otherCelebrationDetail : formData.celebrationType}</strong> on <strong>{formData.proposedDate || 'your selected date'}</strong> has been received. Our planning directors will contact you within 24 hours.
                </p>
                <div style={{ marginTop: '30px' }}>
                  <Link to="/" className="btn-editorial" style={{ color: 'var(--color-gold-dark)', borderColor: 'var(--color-gold-dark)' }}>
                    Return to Homepage
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

import React from 'react';
import './about.css'; // Import the CSS file for styling

function About() {
  const pricingModel = [
    {
      tier: "Free Tier",
      cost: "$0",
      usageLimit: "Up to 5 conversions per month",
      features: ["Basic quality", "Watermark on PDFs"]
    },
    {
      tier: "Basic Tier",
      cost: "$9.99/month",
      usageLimit: "Up to 50 conversions per month",
      features: ["High-quality PDFs", "No watermark", "Email support"]
    },
    {
      tier: "Pro Tier",
      cost: "$19.99/month",
      usageLimit: "Up to 200 conversions per month",
      features: ["Enhanced quality", "Batch processing (up to 5 videos at once)", "Priority email support"]
    },
    {
      tier: "Enterprise Tier",
      cost: "Custom pricing (contact for details)",
      usageLimit: "Unlimited conversions",
      features: ["Premium quality", "Batch processing (unlimited)", "Dedicated account manager", "Custom integrations"]
    },
    {
      tier: "Pay-Per-Use",
      cost: "$0.50 per conversion",
      usageLimit: "No subscription required",
      features: ["Access to high-quality PDFs"]
    }
  ];

  return (
    <div className="about-container">
      <h2>About Page</h2>
      <p>This page provides information about the application.</p>

      <h3>Pricing Model</h3>
      <ul className="pricing-list">
        {pricingModel.map((plan, index) => (
          <li key={index} className="pricing-item">
            <h4>{plan.tier}</h4>
            <p><strong>Cost:</strong> {plan.cost}</p>
            <p><strong>Usage Limit:</strong> {plan.usageLimit}</p>
            <p><strong>Features:</strong></p>
            <ul className="feature-list">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="feature-item">{feature}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default About;

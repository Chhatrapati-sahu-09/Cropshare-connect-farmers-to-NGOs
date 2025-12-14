import React from "react";
import { FaStar } from "react-icons/fa";
import "./Home.css";

const TestimonialsSection = () => {
  return (
    <section className="section">
      <h2 className="section-heading">What Our Community Says</h2>
      <p className="section-subheading">
        Real stories from farmers and NGOs making a difference.
      </p>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <div>
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p className="quote">
              "Instead of wasting surplus tomatoes, we now donate them to local
              food banks. It feels great to help the community and reduce
              waste."
            </p>
          </div>
          <div className="author-info">
            <div className="author-avatar">RK</div>
            <div>
              <div className="author-name">Rajesh Kumar</div>
              <div className="author-role">Farmer, Punjab</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <div>
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p className="quote">
              "CropShare has become our go-to platform for our community
              kitchen. The farmers are responsive and generous."
            </p>
          </div>
          <div className="author-info">
            <div className="author-avatar">SP</div>
            <div>
              <div className="author-name">Sunita Patel</div>
              <div className="author-role">Hope Foundation NGO</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <div>
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p className="quote">
              "The interface is intuitive and the messaging system makes
              coordination easy. We've diverted over 3 tons of rice this
              season!"
            </p>
          </div>
          <div className="author-info">
            <div className="author-avatar">AM</div>
            <div>
              <div className="author-name">Amit Mehta</div>
              <div className="author-role">Farmer, Haryana</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

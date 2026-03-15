function WhyChooseUs() {
  return (
    <section className="pt-section pb-section-box feature-boxex">
      <div className="container" style={{ zIndex: 2, position: "relative" }}>
        <h3 className="font-secoundry mb-5 text-w">Why Choose us</h3>
      </div>

      <div className="container" style={{ zIndex: 2, position: "relative" }}>
        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="f-box box-mb br-5">
              <img src="/img/flexible.png" style={{ height: "50px" }} alt="" />
              <h6 className="font-secoundry mb-4 mt-4">Fully Customizable</h6>
              <span className="mb-2 d-block">
                Your Logo, Your Design, Your Brand.
              </span>
              <span className="text-light">
                We provide fully customized packaging solutions for: Custom
                boxes & cartons, Protective and transit packaging, Eco-friendly
                and sustainable packaging, Short-run and large-scale production.
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="f-box box-mb br-5">
              <img src="/img/packaging.png" style={{ height: "50px" }} alt="" />
              <h6 className="font-secoundry mb-4 mt-4">
                Smart Packaging, Smart Price
              </h6>
              <span className="mb-2 d-block">
                Your product, Your brand, and Your budget
              </span>
              <span className="text-light">
                Expertly designed, fully custom packaging without unnecessary
                costs. We deliver high-quality materials, precise manufacturing,
                and pricing that makes sense for your business.
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="f-box box-mb br-5">
              <img src="/img/pallet.png" style={{ height: "50px" }} alt="" />
              <h6 className="font-secoundry mb-4 mt-4">Low MOQ</h6>
              <span className="mb-2 d-block">Start small. Scale fast.</span>
              <span className="text-light">
                We offer low MOQ packaging solutions, giving flexibility to test
                new products, manage cash flow and scale at your own pace for
                small businesses, seasonal products and limited editions.
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-md-4">
            <div className="f-box box-mb br-5">
              <img
                src="/img/free-shipping.png"
                style={{ height: "50px" }}
                alt=""
              />
              <h6 className="font-secoundry mb-4 mt-4">
                Shipping Across India
              </h6>
              <span className="mb-2 d-block">
                Reliable delivery, wherever your business operates.
              </span>
              <span className="text-light">
                We deliver custom packaging solutions across India, ensuring
                timely and secure delivery to your doorstep, no matter the
                location.
              </span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-md-4">
            <div className="f-box box-mb br-5">
              <img
                src="/img/quality-management.png"
                style={{ height: "50px" }}
                alt=""
              />
              <h6 className="font-secoundry mb-4 mt-4">High Product Quality</h6>
              <span className="mb-2 d-block">
                Built to protect. Designed to impress.
              </span>
              <span className="text-light">
                We use premium materials, precise manufacturing, and strict
                quality checks to ensure every package meets the highest
                standards.
              </span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="col-md-4">
            <div className="f-box box-mb br-5">
              <img src="/img/gift.png" style={{ height: "50px" }} alt="" />
              <h6 className="font-secoundry mb-4 mt-4">Versatility</h6>
              <span className="mb-2 d-block">
                Packaging for every product and industry.
              </span>
              <span className="text-light">
                Wide range: cartons, corrugated boxes, tapes, bubble wraps,
                labels, etc. Suitable for industries: e-commerce, FMCG,
                pharmaceuticals, electronics, retail.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

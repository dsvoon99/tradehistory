export const PerformanceCard = (props) => {

    const { title, value } = props;

    return (
        <div className="performance-card d-flex twrr-card">
            <div>
                <div className="performance-card-title">
                    { title }
                </div>
                <div className="fw-bold">
                    { value  }
                </div>
            </div>
            <div>
                <span class="material-icons">chevron_right</span>
            </div>
        </div>
    )
}
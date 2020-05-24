class PerformanceCalculator {
    // 공연료 계산기 클래스
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() { // amountFor() 함수의 코드를 계산기 클래스로 복사
        let result = 0;
        switch (this.play.type) { // amountFor 함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻음
            case 'tragedy':
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${this.play.type}`);
        }
        return result; // 함수 안에서 값이 바뀌는 변수 반환
    }
}

module.exports = function createStatementData(invoice, plays) { // 중간 데이터 생성을 전담
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); // 공연료 계산기 생성
        const result = Object.assign({}, aPerformance); // 얕은 복사 수행
        result.play = calculator.play; // 중간 데이터에 연극 정보를 저장
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) { // 값이 바뀌지 않는 변수는 매개변수로 전달
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount; // amountFor()도 계산기를 이용하도록 수정
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ('comedy' === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0); // for 반복문을 파이프라인으로
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0); // for 반복문을 파이프라인으로
    }
}